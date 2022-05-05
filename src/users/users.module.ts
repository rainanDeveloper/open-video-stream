import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './schemas/user.entity';
import { UserOtgCode } from './schemas/user-otg-code.entity';
import { UserConfirmationService } from './services/user-confirmation.service';
import { UsersAuthController } from './controllers/users-auth.controller';
import { UsersAuthService } from './services/users-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserOtgCode]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret =
          configService.get<string>('USER_SECRET') ||
          crypto.randomBytes(24).toString('base64');
        const expiresIn = configService.get<string>('USER_EXPIRE_TIME') || '1d';
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService, UserConfirmationService, UsersAuthService],
  controllers: [UsersController, UsersAuthController],
})
export class UsersModule {}
