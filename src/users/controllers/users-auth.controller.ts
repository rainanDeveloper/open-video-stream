import { Controller, Post } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';

@Controller('users-auth')
export class UsersAuthController {
  @Post()
  async login(loginDto: LoginDto) {
    return {};
  }
}
