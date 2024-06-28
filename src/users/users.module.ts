import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { BcryptService } from '@/bcrypt/bcrypt.service';
import { UsersService } from '@/users/users.service';
import { UsersController } from '@/users/users.controller';

@Module({
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, BcryptService],
})
export class UsersModule {}
