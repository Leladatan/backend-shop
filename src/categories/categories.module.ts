import { forwardRef, Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { CategoriesService } from '@/categories/categories.service';
import { ProductsModule } from '@/categories/products/products.module';

@Module({
  imports: [forwardRef(() => ProductsModule)],
  exports: [CategoriesService],
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
