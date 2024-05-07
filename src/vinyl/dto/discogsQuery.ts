import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DiscogsQueryDto {
  @ApiProperty({ example: 'nevermind', required: false })
  @IsString()
  @IsOptional()
  realese_title?: string;

  @ApiProperty({ example: 'nirvana', required: false })
  @IsString()
  @IsOptional()
  artist?: string;
}
