import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import { ItemsPayloadDto } from '@/utils/items.dto';
import {
  UsersFindUserType,
  UsersUpdatePasswordType,
  UsersUpdateUserId,
} from '@/users/types/users.types';
import { AuthPayloadDto } from '@/auth/dto/auth.dto';
import { BcryptService } from '@/bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private bcryptService: BcryptService,
  ) {}

  async getUsers(username?: string): Promise<ItemsPayloadDto<User>> {
    if (username) {
      return this.getUsersItemsPayloadDto(username);
    }

    return this.getUsersItemsPayloadDto();
  }

  async getUserId(userId: number): Promise<User> {
    return await this.findUser({ userId });
  }

  async updateUserId({ userId, payload }: UsersUpdateUserId): Promise<User> {
    await this.findUser({ userId });

    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        ...payload,
      },
    });
  }

  async getUsersItemsPayloadDto(
    username?: string,
  ): Promise<ItemsPayloadDto<User>> {
    if (username) {
      const [items, total] = await this.prismaService.$transaction([
        this.prismaService.user.findMany({
          where: { username: { contains: username } },
        }),
        this.prismaService.user.count(),
      ]);

      return {
        items,
        total,
      };
    }

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany(),
      this.prismaService.user.count(),
    ]);

    return {
      items,
      total,
    };
  }

  async findUser({
    email,
    username,
    userId = 0,
  }: UsersFindUserType): Promise<User> {
    if (userId) {
      const user: User | null = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    }

    return this.prismaService.user.findUnique({
      where: {
        email,
        username,
      },
    });
  }

  async updatePassword({
    userId,
    password,
  }: UsersUpdatePasswordType): Promise<User> {
    const hashedPassword: string = await this.bcryptService.hashData(password);

    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  async isExistUserData({ email, username }: AuthPayloadDto): Promise<{
    isExistEmail: boolean;
    isExistUsername: boolean;
  }> {
    const isExistEmail: User | null = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (isExistEmail) {
      throw new UnauthorizedException('Email already exists');
    }

    const isExistUsername: User | null =
      await this.prismaService.user.findUnique({
        where: {
          username,
        },
      });

    if (isExistUsername) {
      throw new UnauthorizedException('Username already exist');
    }

    return {
      isExistEmail: !!isExistEmail,
      isExistUsername: !!isExistUsername,
    };
  }
}
