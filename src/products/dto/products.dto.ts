import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductsPayloadDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsNumber()
  count: number;
  @IsNotEmpty()
  @IsBoolean()
  isStock: boolean;
  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
export class ProductsWithCategoryPayloadDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsNumber()
  count: number;
  @IsNotEmpty()
  @IsBoolean()
  isStock: boolean;
  @IsNotEmpty()
  @IsNumber()
  stock: number;
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  categoryIds: number[];
  @IsNotEmpty()
  @IsNumber()
  vendorId: number;
}
