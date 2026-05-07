import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@kusmedios.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secretpassword' })
  @IsString()
  @MinLength(6)
  password: string;
}
