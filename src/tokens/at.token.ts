import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtTokenType } from '@/tokens/types/tokens.types';
import { FastifyRequest } from 'fastify';
import { TokensService } from '@/tokens/tokens.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AtToken extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly tokenService: TokensService) {
    super({
      jwtFromRequest: (req: FastifyRequest) => {
        const accessToken: string = req.cookies.accessToken;
        if (!accessToken) {
          throw new UnauthorizedException('No access token provided');
        }
        return accessToken;
      },
      secretOrKey: 'at-secret',
    });
  }

  async validate(payload: jwtTokenType): Promise<jwtTokenType> {
    const isExist: boolean = await this.tokenService.isExistToken(
      Number(payload.id),
    );

    if (!isExist) {
      throw new UnauthorizedException('Invalid access token');
    }

    return payload;
  }
}
