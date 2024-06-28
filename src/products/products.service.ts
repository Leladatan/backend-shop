import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Product, Vendor } from '@prisma/client';
import { ItemsPayloadDto } from '@/utils/items.dto';
import {
  createProductType,
  getProductsItemsPayloadDtoType,
  getProductsType,
  updateProductIdType,
} from '@/products/types/products.types';
import { CategoriesService } from '@/categories/categories.service';
import { VendorsService } from '@/vendors/vendors.service';

@Injectable()
export class ProductsService {
  constructor(
    private prismaService: PrismaService,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
    @Inject(forwardRef(() => VendorsService))
    private vendorsService: VendorsService,
  ) {}

  async getProducts({
    categoryId,
    vendorId,
    name,
  }: getProductsType): Promise<ItemsPayloadDto<Vendor | Product>> {
    if (vendorId) {
      await this.vendorsService.findVendor(vendorId);
      return this.getProductsItemsPayloadDto({ vendorId, name });
    }

    if (categoryId) {
      await this.categoriesService.findCategory(categoryId);
      return this.getProductsItemsPayloadDto({ categoryId, name });
    }

    return this.getProductsItemsPayloadDto({ name });
  }

  async getProductId(productId: number): Promise<Product> {
    return this.findProduct(productId);
  }

  async createProduct({
    categoryIds,
    vendorId,
    ...payload
  }: createProductType): Promise<Product> {
    return this.prismaService.product.create({
      data: {
        ...payload,
        categories: { connect: categoryIds.map((id) => ({ id })) },
        vendors: { connect: { id: vendorId } },
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
    vendorId,
    name,
  }: getProductsItemsPayloadDtoType): Promise<
    ItemsPayloadDto<Product | Vendor>
  > {
    if (!!name && !!vendorId) {
      const [items, total] = await this.prismaService.$transaction([
        this.prismaService.product.findMany({
          where: {
            name: { contains: name },
            vendors: { some: { id: vendorId } },
          },
          orderBy: {
            id: 'asc',
          },
        }),
        this.prismaService.product.count({
          where: {
            name: { contains: name },
            vendors: { some: { id: vendorId } },
          },
        }),
      ]);

      return {
        items,
        total,
      };
    }

    if (vendorId) {
      const [items, total] = await this.prismaService.$transaction([
        this.prismaService.product.findMany({
          where: {
            vendors: { some: { id: vendorId } },
          },
          orderBy: {
            id: 'asc',
          },
        }),
        this.prismaService.product.count({
          where: {
            vendors: { some: { id: vendorId } },
          },
        }),
      ]);

      return {
        items,
        total,
      };
    }

    if (!!name && !!categoryId) {
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
        this.prismaService.product.count({
          where: {
            name: { contains: name },
            categories: { some: { id: categoryId } },
          },
        }),
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
      this.prismaService.product.count({
        where: {
          categories: { some: { id: categoryId } },
        },
      }),
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
