import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './schemas/user.entity';
import { UserOtgCode } from './schemas/user-otg-code.entity';
import { UserConfirmationService } from './services/user-confirmation.service';
import { UsersAuthController } from './controllers/users-auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserOtgCode])],
  providers: [UsersService, UserConfirmationService],
  controllers: [UsersController, UsersAuthController],
})
export class UsersModule {}
