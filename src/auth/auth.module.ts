import { Module } from '@nestjs/common';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersModule } from '@/users/users.module';
import { BcryptModule } from '@/bcrypt/bcrypt.module';
import { AtToken } from '@/auth/tokens/at.token';
import { RtToken } from '@/auth/tokens/rt.token';
import { TokensModule } from '@/auth/tokens/tokens.module';

@Module({
  imports: [TokensModule, UsersModule, BcryptModule],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AtToken, RtToken],
})
export class AuthModule {}
