import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Product } from '@prisma/client';
import { ItemsPayloadDto } from '@/utils/items.dto';
import {
  createProductType,
  getProductsItemsPayloadDtoType,
  getProductsType,
  updateProductIdType,
} from '@/categories/products/types/products.types';
import { CategoriesService } from '@/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    private prismaService: PrismaService,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
  ) {}

  async getProducts({
    categoryId,
    name,
  }: getProductsType): Promise<ItemsPayloadDto<Product>> {
    await this.categoriesService.findCategory(categoryId);
    return this.getProductsItemsPayloadDto({ categoryId, name });
  }

  async getProductId(productId: number): Promise<Product> {
    return this.findProduct(productId);
  }

  async createProduct({
    categoryIds,
    ...payload
  }: createProductType): Promise<Product> {
    if (categoryIds.length > 0) {
      return this.prismaService.product.create({
        data: {
          ...payload,
          categories: { connect: categoryIds.map((id) => ({ id })) },
        },
      });
    }

    return this.prismaService.product.create({
      data: {
        ...payload,
      },
    });
  }

  async updateProductId({
    productId,
    categoryIds,
    ...payload
  }: updateProductIdType): Promise<Product> {
    await this.findProduct(productId);
    return this.prismaService.product.update({
      where: {
        id: productId,
      },
      data: {
        ...payload,
        categories: { connect: categoryIds.map((id) => ({ id })) },
      },
    });
  }

  async deleteProductId(productId: number): Promise<Product> {
    await this.findProduct(productId);
    return this.prismaService.product.delete({
      where: {
        id: productId,
      },
    });
  }

  async getProductsItemsPayloadDto({
    categoryId,
    name,
  }: getProductsItemsPayloadDtoType): Promise<ItemsPayloadDto<Product>> {
    if (name) {
      const [items, total] = await this.prismaService.$transaction([
        this.prismaService.product.findMany({
          where: {
            name: { contains: name },
            categories: { some: { id: categoryId } },
          },
          orderBy: {
            id: 'asc',
          },
        }),
        this.prismaService.product.count(),
      ]);

      return {
        items,
        total,
      };
    }

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.product.findMany({
        where: {
          categories: { some: { id: categoryId } },
        },
        orderBy: {
          id: 'asc',
        },
      }),
      this.prismaService.product.count(),
    ]);

    return {
      items,
      total,
    };
  }

  async findProduct(productId: number) {
    const product: Product | null = await this.prismaService.product.findUnique(
      {
        where: {
          id: productId,
        },
      },
    );

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }
}
