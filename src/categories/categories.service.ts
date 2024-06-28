import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Category } from '@prisma/client';
import { ItemsPayloadDto } from '@/utils/items.dto';
import {
  getCategoryWithProductsType,
  updateCategoryIdType,
} from '@/categories/types/categories.types';
import { CategoriesPayloadDto } from '@/categories/dto/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async getCategories(name: string): Promise<ItemsPayloadDto<Category>> {
    return this.getCategoriesItemsPayloadDto(name);
  }

  async getCategoryId(
    categoryId: number,
  ): Promise<getCategoryWithProductsType> {
    return this.findCategory(categoryId);
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

  async deleteCategoryId(
    categoryId: number,
  ): Promise<getCategoryWithProductsType> {
    const category: getCategoryWithProductsType =
      await this.findCategory(categoryId);
    await this.prismaService.category.delete({
      where: {
        id: categoryId,
      },
      include: {
        products: true,
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
          orderBy: {
            id: 'asc',
          },
        }),
        this.prismaService.category.count({
          where: { name: { contains: name } },
        }),
      ]);

      return {
        items,
        total,
      };
    }

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.category.findMany({
        orderBy: {
          id: 'asc',
        },
      }),
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

  async findCategory(categoryId: number): Promise<getCategoryWithProductsType> {
    const category: getCategoryWithProductsType | null =
      await this.prismaService.category.findUnique({
        where: {
          id: categoryId,
        },
        include: {
          products: true,
        },
      });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async findCategories(
    categoryIds: number[],
  ): Promise<ItemsPayloadDto<Category>> {
    const categories: Category[] = await this.prismaService.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    });

    const notFoundIds: number[] = categoryIds.filter(
      (id: number) =>
        !categories.some((category: Category): boolean => category.id === id),
    );

    if (notFoundIds.length > 0)
      throw new NotFoundException(
        `Not found categories with IDs [${notFoundIds.join(', ')}]`,
      );

    return {
      items: categories,
      total: categories.length,
    };
  }
}
