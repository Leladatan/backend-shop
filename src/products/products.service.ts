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
  getProductWithCategoriesWithVendorType,
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

  async getProductId(
    productId: number,
  ): Promise<getProductWithCategoriesWithVendorType> {
    return this.findProduct(productId);
  }

  async createProduct({
    categoryIds,
    vendorId,
    ...payload
  }: createProductType): Promise<getProductWithCategoriesWithVendorType> {
    await this.categoriesService.findCategories(categoryIds);
    await this.vendorsService.findVendor(vendorId);
    return this.prismaService.product.create({
      data: {
        ...payload,
        categories: { connect: categoryIds.map((id) => ({ id })) },
        vendor: { connect: { id: vendorId } },
      },
      include: {
        categories: true,
        vendor: true,
      },
    });
  }

  async updateProductId({
    productId,
    categoryIds,
    vendorId,
    ...payload
  }: updateProductIdType): Promise<getProductWithCategoriesWithVendorType> {
    await this.findProduct(productId);
    await this.categoriesService.findCategories(categoryIds);
    await this.vendorsService.findVendor(vendorId);
    return this.prismaService.product.update({
      where: {
        id: productId,
      },
      data: {
        ...payload,
        categories: {
          connect: categoryIds.map((id: number): { id: number } => ({ id })),
        },
        vendor: { connect: { id: vendorId } },
      },
      include: {
        categories: true,
        vendor: true,
      },
    });
  }

  async deleteProductId(
    productId: number,
  ): Promise<getProductWithCategoriesWithVendorType> {
    await this.findProduct(productId);
    return this.prismaService.product.delete({
      where: {
        id: productId,
      },
      include: {
        categories: true,
        vendor: true,
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
            vendor: { id: vendorId },
          },
          orderBy: {
            id: 'asc',
          },
        }),
        this.prismaService.product.count({
          where: {
            name: { contains: name },
            vendor: { id: vendorId },
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
            vendor: { id: vendorId },
          },
          orderBy: {
            id: 'asc',
          },
        }),
        this.prismaService.product.count({
          where: {
            vendor: { id: vendorId },
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

  async findProduct(
    productId: number,
  ): Promise<getProductWithCategoriesWithVendorType> {
    const product: getProductWithCategoriesWithVendorType | null =
      await this.prismaService.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          categories: true,
          vendor: true,
        },
      });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }
}
