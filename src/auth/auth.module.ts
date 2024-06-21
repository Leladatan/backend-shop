import { Module } from '@nestjs/common';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { PrismaService } from '@/prisma/prisma.service';
import { TokensModule } from '@/tokens/tokens.module';
import { AtToken } from '@/tokens/at.token';
import { RtToken } from '@/tokens/rt.token';
import { UsersModule } from '@/users/users.module';
import { BcryptModule } from '@/bcrypt/bcrypt.module';

@Module({
  imports: [TokensModule, UsersModule, BcryptModule],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AtToken, RtToken],
})
export class AuthModule {}
