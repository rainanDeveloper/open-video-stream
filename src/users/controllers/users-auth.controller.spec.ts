import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../schemas/user.entity';
import { UsersAuthController } from './users-auth.controller';
import * as crypto from 'crypto';
import { LoginDto } from '../dto/login.dto';
import { UsersAuthService } from '../services/users-auth.service';
import { UnauthorizedException } from '@nestjs/common';

const userList: User[] = [
  new User({
    id: 1,
    login: 'codeminer',
    email: 'starlight.ring@gmail.com',
    password: 'w9esMRGzox4uVGwXMBS7S',
  }),
  new User({
    id: 2,
    login: 'mongosh',
    email: 'homelnader@yahoo.org',
    password: 'z7PXyg4Kfi23aAi3YRWCJB',
  }),
];

describe('UsersAuthController', () => {
  let usersAuthController: UsersAuthController;
  let usersAuthService: UsersAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersAuthController],
      providers: [
        {
          provide: UsersAuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({
              jwt_token: crypto.randomBytes(24).toString('base64'),
            }),
          },
        },
      ],
    }).compile();

    usersAuthController = module.get<UsersAuthController>(UsersAuthController);
    usersAuthService = module.get<UsersAuthService>(UsersAuthService);
  });

  it('should be defined', () => {
    expect(usersAuthController).toBeDefined();
    expect(usersAuthService).toBeDefined();
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      // Arrange
      const userLoginCredentialsDto: LoginDto = {
        email: userList[0].email,
        password: userList[0].password,
      };

      // Act
      const authorization = await usersAuthController.login(
        userLoginCredentialsDto,
      );

      // Assert
      expect(usersAuthService.login).toHaveBeenCalledTimes(1);
      expect(authorization).toBeDefined();
      expect(authorization.jwt_token).toBeDefined();
    });

    it('should throw an UnauthorizedException when method "login" on usersAuthService throws UnauthorizedException', () => {
      // Arrange
      const userLoginCredentialsDto: LoginDto = {
        email: userList[0].email,
        password: userList[0].password,
      };
      jest
        .spyOn(usersAuthService, 'login')
        .mockRejectedValueOnce(new UnauthorizedException());

      // Act
      const resultPromise = usersAuthController.login(userLoginCredentialsDto);

      // Assert
      expect(resultPromise).rejects.toThrow(UnauthorizedException);
    });
  });
});
