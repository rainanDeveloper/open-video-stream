import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { UsersAuthService } from '../services/users-auth.service';

@Controller('users-auth')
@ApiTags('Users Authentication')
export class UsersAuthController {
  constructor(private readonly usersAuthService: UsersAuthService) {}
  @Post()
  async login(@Body() loginDto: LoginDto) {
    return await this.usersAuthService.login(loginDto);
  }
}
