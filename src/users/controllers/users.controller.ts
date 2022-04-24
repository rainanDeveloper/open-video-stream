import {
  Body,
  Controller,
  Post,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../schemas/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { UserConfirmationService } from '../services/user-confirmation.service';
import { SendMailProducerService } from '../../common/jobs/send-mail/services/send-mail-producer.service';
import { ConfigService } from '@nestjs/config';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly userConfirmationService: UserConfirmationService,
    private readonly mailQueueService: SendMailProducerService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.userService.create(createUserDto);

      const otgCode = await this.userConfirmationService.create({
        email: newUser.email,
      });

      this.mailQueueService.sendConfirmationEmail({
        userEmail: createUserDto.email,
        userLogin: createUserDto.login,
        otgCode: otgCode.otgCode,
        app_name: this.configService.get('APP_NAME') || 'Open Video Stream Api',
      });

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
