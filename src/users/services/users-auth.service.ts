import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { UsersService } from './users.service';

@Injectable()
export class UsersAuthService {
  constructor(private readonly userService: UsersService) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);

    const passwordMatch = this.userService.comparePassword(
      loginDto.password,
      user.password,
    );

    return {
      jwt_password: '',
    };
  }
}
