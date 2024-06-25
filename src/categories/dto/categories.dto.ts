import { IsNotEmpty, IsString } from 'class-validator';

export class CategoriesPayloadDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
}
