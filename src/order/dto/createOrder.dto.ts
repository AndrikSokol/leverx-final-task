import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: [10, 11] })
  vinylsId: number[];
}
