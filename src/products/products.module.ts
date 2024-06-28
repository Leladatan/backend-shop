import { forwardRef, Module } from '@nestjs/common';
import { CategoriesModule } from '@/categories/categories.module';
import { PrismaService } from '@/prisma/prisma.service';
import { VendorsModule } from '@/vendors/vendors.module';
import { ProductsService } from '@/products/products.service';
import { ProductsController } from '@/products/products.controller';

@Module({
  imports: [forwardRef(() => CategoriesModule), VendorsModule],
  exports: [ProductsService],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
