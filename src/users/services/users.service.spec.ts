import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../schemas/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

const userList: User[] = [
  new User({
    id: 1,
    login: 'TheWretchedZoic',
    email: 'erdman.nova@oberbrunner.com',
    password: 'Q57YHtRDcJ8xZ6uTBSpih',
  }),
];

const CONFIG_VALUES = {
  HASH_DIFFICULTY: 16,
};

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: {} },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => CONFIG_VALUES[key]),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('createHash', () => {
    it('should create a hash for a input value', async () => {
      // Arrange
      const password = 'Bp3Mb6A2BhSLRonFdHwQm';

      // Act
      const hash: string = await userService.createHash(password);

      // Assert
      expect(hash).toBeDefined();
      expect(typeof hash).toEqual('string');
      expect(hash.replace(/(\$\d\w)(\$\d+).+/g, '$1$2')).toEqual(
        (
          await bcrypt.hashSync(password, CONFIG_VALUES.HASH_DIFFICULTY || 12)
        ).replace(/(\$\d\w)(\$\d+).+/g, '$1$2'),
      );
    });
  });

  describe('transformBody', () => {
    it('should treat the user dto and return a modified dto', async () => {
      // Arrange
      const userDto: CreateUserDto = {
        login: 'ZoiowByuis',
        email: 'ykoelpin@yahoo.com',
        password: 'D3SXf5Vr3dj79ccHPiSZ9',
      };

      // Act
      const result: CreateUserDto = await userService.transformBody(userDto);

      // Assert
      expect(result).toEqual({
        login: userDto.login,
        email: userDto.email,
        password: expect.any(String),
      });
    });
  });
});
