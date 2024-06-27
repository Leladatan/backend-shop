import {
  ProductsPayloadDto,
  ProductsWithCategoryPayloadDto,
} from '@/categories/products/dto/products.dto';

export type getProductsType = {
  categoryId: number;
  name: string;
};
export type getProductsItemsPayloadDtoType = {
  categoryId: number;
  name: string;
};
export type createProductType = ProductsPayloadDto & {
  categoryIds?: number[];
};
export type updateProductIdType = ProductsWithCategoryPayloadDto & {
  productId: number;
};
