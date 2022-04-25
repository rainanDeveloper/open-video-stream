import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../schemas/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserConfirmationService } from '../services/user-confirmation.service';
import { UserOtgCode } from '../schemas/user-otg-code.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SendMailProducerService } from '../../common/jobs/send-mail/services/send-mail-producer.service';
import { ConfigModule } from '@nestjs/config';
import { ActivateUserDto } from '../dto/activate-user.dto';

const userList: User[] = [
  new User({
    id: 1,
    login: 'Cloisteredsama',
    email: 'paucek.luther@gmail.com',
    password: 'w43Bo3wjcGuF44qLhhhRFK',
  }),
  new User({
    id: 2,
    login: 'MunchOfPeso',
    email: 'ellen.swaniawski@aufderhar.org',
    password: 'b9TAPfpfm7J9TPueEzhriK',
  }),
];

const userOtgCodeList: UserOtgCode[] = [
  new UserOtgCode({
    id: 1,
    email: userList[0].email,
    user: userList[0],
  }),
  new UserOtgCode({
    id: 2,
    email: userList[1].email,
    user: userList[2],
  }),
];

describe('UsersController', () => {
  let userController: UsersController;
  let userService: UsersService;
  let userConfirmationService: UserConfirmationService;
  let mailQueueService: SendMailProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(userList[0]),
            update: jest.fn().mockResolvedValue(userList[0]),
            findOne: jest.fn().mockResolvedValue(userList[0]),
          },
        },
        {
          provide: UserConfirmationService,
          useValue: {
            create: jest.fn().mockResolvedValue(userOtgCodeList[0]),
            updateOtgCode: jest.fn().mockResolvedValue(userOtgCodeList[0]),
            findOneByEmail: jest.fn().mockResolvedValue(userOtgCodeList[0]),
            delete: jest.fn().mockResolvedValue(userOtgCodeList[0]),
          },
        },
        {
          provide: SendMailProducerService,
          useValue: {
            sendConfirmationEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
    userConfirmationService = module.get<UserConfirmationService>(
      UserConfirmationService,
    );
    mailQueueService = module.get<SendMailProducerService>(
      SendMailProducerService,
    );
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
    expect(userConfirmationService).toBeDefined();
    expect(mailQueueService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      // Arrange
      const userDto: CreateUserDto = {
        login: 'ClomunChed',
        email: 'dan21@rippin.info',
        password: '49RFrmbXMVhGuMAkEAfVdQ',
      };

      // Act
      const result: User = await userController.create(userDto);

      // Assert
      expect(result).toEqual(userList[0]);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userConfirmationService.create).toHaveBeenCalledTimes(1);
      expect(mailQueueService.sendConfirmationEmail).toHaveBeenCalledTimes(1);
    });
    it('should throw an InternalServerErrorException when method create on user service fails', () => {
      // Arrange
      const userDto: CreateUserDto = {
        login: 'ClomunChed',
        email: 'dan21@rippin.info',
        password: '49RFrmbXMVhGuMAkEAfVdQ',
      };
      jest.spyOn(userService, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(userController.create(userDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('activateWithOtgCode', () => {
    it('should activate a user successfully', async () => {
      // Arrange
      const activateUserDto: ActivateUserDto = {
        email: userList[0].email,
        otgCode: userOtgCodeList[0].otgCode,
      };

      // Act
      await userController.activateWithOtgCode(activateUserDto);

      // Assert
      expect(userConfirmationService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findOne).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException when findOneByEmail method on userConfirmationService throws a NotFoundException', async () => {
      // Arrange
      const activateUserDto: ActivateUserDto = {
        email: userList[0].email,
        otgCode: userOtgCodeList[0].otgCode,
      };

      jest
        .spyOn(userConfirmationService, 'findOneByEmail')
        .mockRejectedValueOnce(new NotFoundException());

      // Assert
      expect(
        userController.activateWithOtgCode(activateUserDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw a NotFoundException when findOne method on userService throws a NotFoundException', async () => {
      // Arrange
      const activateUserDto: ActivateUserDto = {
        email: userList[0].email,
        otgCode: userOtgCodeList[0].otgCode,
      };

      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      // Assert
      expect(
        userController.activateWithOtgCode(activateUserDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
