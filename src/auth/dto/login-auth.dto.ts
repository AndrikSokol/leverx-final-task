import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'AndrikSokol31@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 123,
  })
  @MinLength(2)
  @IsString()
  password: string;
}
