import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Category } from '@prisma/client';
import { ItemsPayloadDto } from '@/utils/items.dto';
import { updateCategoryIdType } from '@/categories/types/categories.types';
import { CategoriesPayloadDto } from '@/categories/dto/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async getCategories(name: string): Promise<ItemsPayloadDto<Category>> {
    return this.getCategoriesItemsPayloadDto(name);
  }

  async getCategoryId(categoryId: number): Promise<Category> {
    await this.findCategory(categoryId);
    return this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });
  }

  async createCategory(payload: CategoriesPayloadDto): Promise<Category> {
    await this.isExistCategoryData(payload);
    return this.prismaService.category.create({
      data: {
        ...payload,
      },
    });
  }

  async updateCategoryId({
    categoryId,
    payload,
  }: updateCategoryIdType): Promise<Category> {
    await this.findCategory(categoryId);
    return this.prismaService.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...payload,
      },
    });
  }

  async deleteCategoryId(categoryId: number): Promise<Category> {
    const category: Category = await this.findCategory(categoryId);
    await this.prismaService.category.delete({
      where: {
        id: categoryId,
      },
    });
    return category;
  }

  async getCategoriesItemsPayloadDto(
    name?: string,
  ): Promise<ItemsPayloadDto<Category>> {
    if (name) {
      const [items, total] = await this.prismaService.$transaction([
        this.prismaService.category.findMany({
          where: { name: { contains: name } },
        }),
        this.prismaService.category.count(),
      ]);

      return {
        items,
        total,
      };
    }

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.category.findMany(),
      this.prismaService.category.count(),
    ]);

    return {
      items,
      total,
    };
  }

  async isExistCategoryData(payload: CategoriesPayloadDto): Promise<boolean> {
    const category: Category | null =
      await this.prismaService.category.findUnique({
        where: {
          ...payload,
        },
      });

    if (category) throw new BadRequestException('Category already exists');

    return !!category;
  }

  async findCategory(categoryId: number): Promise<Category> {
    const category: Category | null =
      await this.prismaService.category.findUnique({
        where: {
          id: categoryId,
        },
      });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }
}
