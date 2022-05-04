import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class UsersAuthService {
  async login(loginDto: LoginDto) {
    return {};
  }
}
