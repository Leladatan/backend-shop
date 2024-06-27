import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthPasswordPayloadDto, AuthPayloadDto } from '@/auth/dto/auth.dto';
import { FastifyReply } from 'fastify';
import { GetCurrentUser } from '@/utils/decorators/get-current-user.decorator';
import { Public } from '@/utils/decorators/public.decorator';
import { RtGuard } from '@/utils/guards/rt.guard';
import { User } from '@prisma/client';
import { TokensPayloadDto } from '@/auth/tokens/dto/tokens.dto';
import { TokensService } from '@/auth/tokens/tokens.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
  ) {}

  @Get('refresh')
  @UseGuards(RtGuard)
  async refresh(
    @GetCurrentUser('id') userId: number,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<TokensPayloadDto> {
    return this.tokensService.refreshTokens({ userId, res });
  }

  @Get('logout')
  async logout(
    @GetCurrentUser('id') userId: number,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    return this.authService.logout({ userId, res });
  }

  @Public()
  @Post('sign-in')
  @HttpCode(200)
  async signIn(
    @Body() payload: AuthPayloadDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<TokensPayloadDto> {
    return this.authService.signIn({ payload, res });
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() payload: AuthPayloadDto): Promise<AuthPayloadDto> {
    return this.authService.signUp(payload);
  }

  @Patch('change-password')
  async changePassword(
    @GetCurrentUser('id') userId: number,
    @Body() payload: AuthPasswordPayloadDto,
  ): Promise<User> {
    return this.authService.changePassword({ userId, ...payload });
  }
}
