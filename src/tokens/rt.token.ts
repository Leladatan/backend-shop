import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { jwtTokenType } from '@/tokens/types/tokens.types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokensService } from '@/tokens/tokens.service';

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
