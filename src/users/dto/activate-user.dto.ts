import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ActivateUserDto {
  @ApiProperty()
  @IsEmail('"email" field must be a email')
  @IsNotEmpty({ message: '"email" field must be filled' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: '"otgCode" field must be filled' })
  otgCode: string;
}
