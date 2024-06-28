import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CategoriesService } from '@/categories/categories.service';
import { ProductsModule } from '@/products/products.module';
import { CategoriesController } from '@/categories/categories.controller';

@Module({
  imports: [forwardRef(() => ProductsModule)],
  exports: [CategoriesService],
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
