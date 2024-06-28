import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VendorsPayloadDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  INN: string;
  @IsNotEmpty()
  @IsString()
  OGRNIP: string;
  @IsNotEmpty()
  @IsString()
  registration_number: string;
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}