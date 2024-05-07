import { Order } from '@/enum/order.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterQueryDto {
  @ApiProperty({ example: 'vinyl', nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Andrei', nullable: true })
  @IsOptional()
  @IsString()
  authorName?: string;

  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly orderName?: Order = Order.ASC;

  @ApiPropertyOptional({
    enum: Order,
    default: Order.ASC,
  })
  @IsEnum(Order)
  @IsOptional()
  readonly orderAuthorName?: Order = Order.ASC;

  @ApiPropertyOptional({
    enum: Order,
    default: Order.ASC,
  })
  @IsEnum(Order)
  @IsOptional()
  readonly orderPrice?: Order = Order.ASC;
}
