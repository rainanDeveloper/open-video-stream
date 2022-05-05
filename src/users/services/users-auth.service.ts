import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { UsersService } from './users.service';

@Injectable()
export class UsersAuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);

    const passwordMatch = this.userService.comparePassword(
      loginDto.password,
      user.password,
    );

    const payload = {
      email: loginDto.email,
      sub: user.id,
    };

    const jwt_password = this.jwtService.sign(payload);

    return {
      jwt_password,
    };
  }
}
