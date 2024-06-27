import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategoriesModule } from '@/categories/categories.module';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [forwardRef(() => CategoriesModule)],
  exports: [ProductsService],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
