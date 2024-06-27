import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthPayloadDto } from '@/auth/dto/auth.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  changePasswordType,
  comparePasswordType,
  loginType,
  logoutType,
} from '@/auth/types/auth.types';
import { UsersService } from '@/users/users.service';
import { BcryptService } from '@/bcrypt/bcrypt.service';
import { TokensService } from '@/auth/tokens/tokens.service';
import { TokensPayloadDto } from '@/auth/tokens/dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private tokensService: TokensService,
    private usersService: UsersService,
    private bcryptService: BcryptService,
  ) {}

  async signIn({ payload, res }: loginType): Promise<TokensPayloadDto> {
    const user: User = await this.usersService.findUser(payload);

    await this.comparePassword({
      password: payload.password,
      userPassword: user.password,
    });

    const isExistToken: boolean = await this.tokensService.isExistTokenForAuth(
      user.id,
    );

    const { accessToken, refreshToken } = await this.tokensService.getTokens({
      userId: user.id,
      ...payload,
    });

    if (!isExistToken) {
      await this.tokensService.createTokens({
        userId: user.id,
        rt: refreshToken,
        at: accessToken,
      });
    }

    if (isExistToken) {
      await this.tokensService.updateTokens({
        userId: user.id,
        at: accessToken,
        rt: refreshToken,
      });
    }

    await this.tokensService.cookiesCreate({
      res,
      at: accessToken,
      rt: refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(payload: AuthPayloadDto): Promise<AuthPayloadDto> {
    await this.usersService.isExistUserData(payload);

    const password: string = await this.bcryptService.hashData(
      payload.password,
    );

    return this.prismaService.user.create({
      data: {
        ...payload,
        password,
      },
    });
  }

  async changePassword({
    userId,
    password,
    new_password,
  }: changePasswordType): Promise<User> {
    const user: User = await this.usersService.findUser({ userId });

    await this.comparePassword({
      password,
      userPassword: user.password,
    });

    return this.usersService.updatePassword({ userId, password: new_password });
  }

  async logout({ userId, res }: logoutType): Promise<void> {
    await this.tokensService.isExistToken(userId);
    await this.tokensService.cookiesClear(res);
    await this.tokensService.deleteTokens(userId);
  }

  async comparePassword({
    password,
    userPassword,
  }: comparePasswordType): Promise<boolean> {
    const isCompare: boolean = await bcrypt.compare(password, userPassword);

    if (!isCompare) {
      throw new UnauthorizedException('Password do not match');
    }

    return isCompare;
  }
}
