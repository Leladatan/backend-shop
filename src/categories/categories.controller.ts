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
import { Category } from '@prisma/client';
import { ItemsPayloadDto } from '@/utils/items.dto';
import { Public } from '@/utils/decorators/public.decorator';
import { CategoriesPayloadDto } from '@/categories/dto/categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  async getCategories(
    @Query() query: { name: string },
  ): Promise<ItemsPayloadDto<Category>> {
    return this.categoriesService.getCategories(query.name);
  }

  @Public()
  @Get(':id')
  async getCategoryId(@Param('id') categoryId: string): Promise<Category> {
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
  async deleteCategoryId(@Param('id') categoryId: string): Promise<Category> {
    return this.categoriesService.deleteCategoryId(Number(categoryId));
  }
}
