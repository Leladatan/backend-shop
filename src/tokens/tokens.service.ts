import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Token } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { TokensPayloadDto } from '@/tokens/dto/tokens.dto';
import {
  cookiesCreateType,
  createTokensType,
  getTokensType,
  updateTokensType,
} from '@/tokens/types/tokens.types';
import { FastifyReply } from 'fastify';
import { BcryptService } from '@/bcrypt/bcrypt.service';

@Injectable()
export class TokensService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async getTokens({
    email,
    username,
    userId,
  }: getTokensType): Promise<TokensPayloadDto> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          username,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          username,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async createTokens({ rt, at, userId }: createTokensType): Promise<void> {
    const accessToken: string = await this.bcryptService.hashData(at);
    const refreshToken: string = await this.bcryptService.hashData(rt);

    await this.prismaService.token.create({
      data: {
        userId,
        accessToken,
        refreshToken,
      },
    });
  }

  async updateTokens({ userId, at, rt }: updateTokensType): Promise<void> {
    const accessToken: string = await this.bcryptService.hashData(at);
    const refreshToken: string = await this.bcryptService.hashData(rt);

    await this.prismaService.token.update({
      where: {
        userId,
      },
      data: {
        accessToken,
        refreshToken,
      },
    });
  }

  async deleteTokens(userId: number): Promise<void> {
    await this.prismaService.token.delete({
      where: {
        userId,
      },
    });
  }

  async isExistTokenForAuth(userId: number): Promise<boolean> {
    const token: Token | null = await this.prismaService.token.findUnique({
      where: {
        userId,
      },
    });

    return !!token;
  }

  async isExistToken(userId: number): Promise<boolean> {
    const token: Token | null = await this.prismaService.token.findUnique({
      where: {
        userId,
      },
    });

    if (!token) {
      throw new UnauthorizedException('Token does not exist');
    }

    return !!token;
  }

  async cookiesCreate({ res, at, rt }: cookiesCreateType): Promise<void> {
    res.setCookie('accessToken', at);
    res.setCookie('refreshToken', rt);
  }

  async cookiesClear(res: FastifyReply): Promise<void> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}
