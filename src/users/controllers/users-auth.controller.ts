import { Controller } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';

@Controller('users-auth')
export class UsersAuthController {
  async login(loginDto: LoginDto) {
    return {};
  }
}
