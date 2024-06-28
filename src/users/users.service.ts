import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import { ItemsPayloadDto } from '@/utils/items.dto';
import {
  findUserType,
  getUserWithVendor,
  updatePasswordType,
  updateUserId,
} from '@/users/types/users.types';
import { AuthPayloadDto } from '@/auth/dto/auth.dto';
import { BcryptService } from '@/bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private bcryptService: BcryptService,
  ) {}

  async getUsers(username: string): Promise<ItemsPayloadDto<User>> {
    return this.getUsersItemsPayloadDto(username);
  }

  async getUserId(userId: number): Promise<getUserWithVendor> {
    return await this.findUser({ userId });
  }

  async updateUserId({ userId, payload }: updateUserId): Promise<User> {
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
          orderBy: {
            id: 'asc',
          },
        }),
        this.prismaService.user.count({
          where: { username: { contains: username } },
        }),
      ]);

      return {
        items,
        total,
      };
    }

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        orderBy: {
          id: 'asc',
        },
      }),
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
  }: findUserType): Promise<getUserWithVendor> {
    if (userId) {
      const user: getUserWithVendor | null =
        await this.prismaService.user.findUnique({
          where: {
            id: userId,
          },
          include: {
            vendor: true,
          },
        });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    }

    const user: getUserWithVendor | null =
      await this.prismaService.user.findUnique({
        where: {
          email,
          username,
        },
        include: {
          vendor: true,
        },
      });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updatePassword({
    userId,
    password,
  }: updatePasswordType): Promise<User> {
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

    if (isExistEmail) throw new UnauthorizedException('Email already exists');

    const isExistUsername: User | null =
      await this.prismaService.user.findUnique({
        where: {
          username,
        },
      });

    if (isExistUsername)
      throw new UnauthorizedException('Username already exists');

    return {
      isExistEmail: !!isExistEmail,
      isExistUsername: !!isExistUsername,
    };
  }
}
