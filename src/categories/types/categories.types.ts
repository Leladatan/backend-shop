import { CategoriesPayloadDto } from '@/categories/dto/categories.dto';
import { Category, Product } from '@prisma/client';

export type updateCategoryIdType = {
  categoryId: number;
  payload: CategoriesPayloadDto;
};
export type getCategoryWithProductsType = Category & {
  products: Product[];
};
