import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '@/prisma/prisma.service';
import { BcryptService } from '@/bcrypt/bcrypt.service';

@Module({
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, BcryptService],
})
export class UsersModule {}
