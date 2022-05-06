import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    let user;
    try {
      user = await this.userService.findOneByEmail(loginDto.email);
    } catch (error) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const passwordMatch = await this.userService.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!passwordMatch) throw new UnauthorizedException(`Invalid credentials`);

    const payload = {
      email: loginDto.email,
      sub: user.id,
    };

    const jwt_token = this.jwtService.sign(payload);

    return {
      jwt_token,
    };
  }
}
