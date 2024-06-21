import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from '@/tokens/tokens.service';
import { PrismaService } from '@/prisma/prisma.service';
import { AtToken } from '@/tokens/at.token';
import { RtToken } from '@/tokens/rt.token';
import { BcryptService } from '@/bcrypt/bcrypt.service';

@Module({
  imports: [JwtModule.register({})],
  exports: [TokensService],
  providers: [TokensService, PrismaService, BcryptService, AtToken, RtToken],
})
export class TokensModule {}
