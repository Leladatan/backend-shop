import {
  ProductsPayloadDto,
  ProductsWithCategoryPayloadDto,
} from '@/products/dto/products.dto';
import { Category, Vendor } from '@prisma/client';

export type getProductsType = {
  categoryId?: number;
  vendorId?: number;
  name: string;
};
export type getProductsItemsPayloadDtoType = {
  categoryId?: number;
  vendorId?: number;
  name: string;
};
export type createProductType = ProductsPayloadDto & {
  categoryIds: number[];
  vendorId: number;
};
export type updateProductIdType = ProductsWithCategoryPayloadDto & {
  productId: number;
};
export type getProductWithCategoriesWithVendorType = {
  categories: Category[];
  vendor: Vendor;
};
