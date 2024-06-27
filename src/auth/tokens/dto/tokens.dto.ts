import { IsNotEmpty, IsString } from 'class-validator';

export class TokensPayloadDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
