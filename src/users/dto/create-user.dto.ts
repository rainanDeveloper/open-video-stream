import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: `The field "login" is required` })
  login: string;

  @ApiProperty()
  @IsNotEmpty({ message: `The field "email" is required` })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: `The field "password" is required` })
  password: string;
}
