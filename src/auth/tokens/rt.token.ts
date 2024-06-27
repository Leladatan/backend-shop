import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokensService } from '@/auth/tokens/tokens.service';
import { jwtTokenType } from '@/auth/tokens/types/tokens.types';

@Injectable()
export class RtToken extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly tokenService: TokensService) {
    super({
      jwtFromRequest: (req: FastifyRequest): null | string => {
        const refreshToken: string = req.cookies.refreshToken;
        if (!refreshToken) {
          return null;
        }
        return refreshToken;
      },
      secretOrKey: 'rt-secret',
      passReqToCallback: true,
    });
  }

  async validate(
    req: FastifyRequest,
    payload: jwtTokenType,
  ): Promise<jwtTokenType & { refreshToken: string }> {
    const refreshToken: string = req.cookies.refreshToken;

    const isExist: boolean = await this.tokenService.isExistToken(
      Number(payload.id),
    );

    if (!isExist) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
