import { ApiProperty } from '@nestjs/swagger';

export class ItemsPayloadDto<T> {
  @ApiProperty()
  items: T[];
  @ApiProperty()
  total: number;
}
