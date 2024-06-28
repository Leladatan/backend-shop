import {
  ProductsPayloadDto,
  ProductsWithCategoryPayloadDto,
} from '@/products/dto/products.dto';

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
