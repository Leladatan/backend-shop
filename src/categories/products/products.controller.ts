import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from '@/categories/products/products.service';
import { Public } from '@/utils/decorators/public.decorator';
import { ProductsWithCategoryPayloadDto } from '@/categories/products/dto/products.dto';
import { Product } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Post()
  async createProduct(
    @Body() payload: ProductsWithCategoryPayloadDto,
  ): Promise<Product> {
    return this.productsService.createProduct(payload);
  }

  @Public()
  @Get(':id')
  async getProductId(@Param('id') productId: string): Promise<Product> {
    return this.productsService.getProductId(Number(productId));
  }

  @Public()
  @Patch(':id')
  async updateProductId(
    @Param('id') productId: string,
    @Body() payload: ProductsWithCategoryPayloadDto,
  ): Promise<Product> {
    return this.productsService.updateProductId({
      productId: Number(productId),
      ...payload,
    });
  }

  @Public()
  @Post(':id')
  async deleteProductId(@Param('id') productId: string): Promise<Product> {
    return this.productsService.deleteProductId(Number(productId));
  }
}
