import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

@Controller('users-auth')
@ApiTags('Users Authentication')
export class UsersAuthController {
  @Post()
  async login(loginDto: LoginDto) {
    return {};
  }
}
