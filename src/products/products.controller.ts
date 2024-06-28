import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from '@/products/products.service';
import { Public } from '@/utils/decorators/public.decorator';
import { ProductsWithCategoryPayloadDto } from '@/products/dto/products.dto';
import { Product } from '@prisma/client';
import { ItemsPayloadDto } from '@/utils/items.dto';
import { getProductWithCategoriesWithVendorType } from '@/products/types/products.types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  async getProduct(
    @Query() query: { name: string },
  ): Promise<ItemsPayloadDto<Product>> {
    return this.productsService.getProducts({ name: query.name }) as Promise<
      ItemsPayloadDto<Product>
    >;
  }

  @Public()
  @Get(':id')
  async getProductId(
    @Param('id') productId: string,
  ): Promise<getProductWithCategoriesWithVendorType> {
    return this.productsService.getProductId(Number(productId));
  }

  @Public()
  @Post()
  async createProduct(
    @Body() payload: ProductsWithCategoryPayloadDto,
  ): Promise<getProductWithCategoriesWithVendorType> {
    return this.productsService.createProduct(payload);
  }

  @Public()
  @Patch(':id')
  async updateProductId(
    @Param('id') productId: string,
    @Body() payload: ProductsWithCategoryPayloadDto,
  ): Promise<getProductWithCategoriesWithVendorType> {
    return this.productsService.updateProductId({
      productId: Number(productId),
      ...payload,
    });
  }

  @Public()
  @Delete(':id')
  async deleteProductId(
    @Param('id') productId: string,
  ): Promise<getProductWithCategoriesWithVendorType> {
    return this.productsService.deleteProductId(Number(productId));
  }
}
