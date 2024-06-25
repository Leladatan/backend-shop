import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { CategoriesService } from '@/categories/categories.service';

@Module({
  exports: [CategoriesService],
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
