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
import { CategoriesService } from '@/categories/categories.service';
import { Category, Product } from '@prisma/client';
import { ItemsPayloadDto } from '@/utils/items.dto';
import { Public } from '@/utils/decorators/public.decorator';
import { CategoriesPayloadDto } from '@/categories/dto/categories.dto';
import { ProductsService } from '@/products/products.service';
import { getCategoryWithProductsType } from '@/categories/types/categories.types';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Public()
  @Get()
  async getCategories(
    @Query() query: { name: string },
  ): Promise<ItemsPayloadDto<Category>> {
    return this.categoriesService.getCategories(query.name);
  }

  @Public()
  @Get(':id')
  async getCategoryId(
    @Param('id') categoryId: string,
  ): Promise<getCategoryWithProductsType> {
    return this.categoriesService.getCategoryId(Number(categoryId));
  }

  @Public()
  @Post()
  async createCategory(
    @Body() payload: CategoriesPayloadDto,
  ): Promise<Category> {
    return this.categoriesService.createCategory(payload);
  }

  @Public()
  @Patch(':id')
  async updateCategoryId(
    @Param('id') categoryId: string,
    @Body() payload: CategoriesPayloadDto,
  ): Promise<Category> {
    return this.categoriesService.updateCategoryId({
      categoryId: Number(categoryId),
      payload,
    });
  }

  @Public()
  @Delete(':id')
  async deleteCategoryId(
    @Param('id') categoryId: string,
  ): Promise<getCategoryWithProductsType> {
    return this.categoriesService.deleteCategoryId(Number(categoryId));
  }

  //  Products

  @Public()
  @Get(':id/products')
  async getProducts(
    @Param('id') categoryId: string,
    @Query() query: { name: string },
  ): Promise<ItemsPayloadDto<Product>> {
    return this.productsService.getProducts({
      categoryId: Number(categoryId),
      name: query.name,
    }) as Promise<ItemsPayloadDto<Product>>;
  }
}
