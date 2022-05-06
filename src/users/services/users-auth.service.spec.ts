import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from '../dto/login.dto';
import { User } from '../schemas/user.entity';
import { UsersAuthService } from './users-auth.service';
import { UsersService } from './users.service';
import * as crypto from 'crypto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

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

describe('UsersAuthService', () => {
  let usersAuthService: UsersAuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersAuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue(userList[0]),
            comparePassword: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest
              .fn()
              .mockReturnValue(crypto.randomBytes(24).toString('base64')),
          },
        },
      ],
    }).compile();

    usersAuthService = module.get<UsersAuthService>(UsersAuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(usersAuthService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('login', () => {
    it('should log in a user sucessfully', async () => {
      // Arrange
      const userLoginCredentialsDto: LoginDto = {
        email: userList[0].email,
        password: userList[0].password,
      };

      // Act
      const authorization = await usersAuthService.login(
        userLoginCredentialsDto,
      );
      // Assert
      expect(usersService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(usersService.comparePassword).toHaveBeenCalledTimes(1);
      expect(authorization).toBeDefined();
      expect(authorization.jwt_token).toBeDefined();
      expect(typeof authorization.jwt_token).toEqual('string');
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
    });

    it('should throw an NotFoundException when the method "findOneByEmail" on usersService throws a UnauthorizedException', () => {
      // Arrange
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockRejectedValueOnce(new NotFoundException());
      const userLoginCredentialsDto: LoginDto = {
        email: userList[0].email,
        password: userList[0].password,
      };

      // Act
      const resultPromise = usersAuthService.login(userLoginCredentialsDto);

      // Assert
      expect(resultPromise).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an UnauthorizedException when method "comparePassword" on usersService returns false', () => {
      // Arrange
      jest.spyOn(usersService, 'comparePassword').mockResolvedValue(false);
      const userLoginCredentialsDto: LoginDto = {
        email: userList[0].email,
        password: userList[0].password,
      };

      // Act
      const resultPromise = usersAuthService.login(userLoginCredentialsDto);

      // Assert
      expect(resultPromise).rejects.toThrow(UnauthorizedException);
    });
  });
});
