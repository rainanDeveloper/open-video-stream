import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserOtgCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  user: any;
}
