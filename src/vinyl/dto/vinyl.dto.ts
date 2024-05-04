import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class VinylDto {
  @ApiProperty({ example: 'Andrei Sakalouski' })
  @IsString()
  authorName: string;

  @ApiProperty({ example: 'Vinyl 1' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'desc 2' })
  @IsString()
  description: string;

  @ApiProperty({
    example: '2024-05-02/9440461-385eba4c-d31b-4171-8624-fe8c36870c70.webp',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  price: number;
}
