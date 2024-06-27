import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { BcryptService } from '@/bcrypt/bcrypt.service';
import { TokensService } from '@/auth/tokens/tokens.service';
import { AtToken } from '@/auth/tokens/at.token';
import { RtToken } from '@/auth/tokens/rt.token';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  exports: [TokensService],
  providers: [TokensService, PrismaService, BcryptService, AtToken, RtToken],
})
export class TokensModule {}
