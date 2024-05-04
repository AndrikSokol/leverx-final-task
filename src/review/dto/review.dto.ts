import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  vinylId: number;
  @ApiProperty({ example: 'This is awesome' })
  @IsString()
  comment: string;
  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0, {
    message: 'score must be between 0-10',
  })
  @Max(10, {
    message: 'score must be between 0-10',
  })
  score: number;
}
