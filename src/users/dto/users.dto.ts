import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UsersPayloadDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  username: string;
}
