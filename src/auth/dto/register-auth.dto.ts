import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'Andrei',
  })
  @MinLength(2, { message: 'first name must be more than 2 char' })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Sakalouski',
  })
  @MinLength(2, { message: 'last name must be more than 2 char' })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'AndrikSokol31@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 123,
  })
  @MinLength(2, { message: 'password must be more than 2 char' })
  @IsNotEmpty()
  password: string;
}
