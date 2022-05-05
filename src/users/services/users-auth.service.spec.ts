import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from '../dto/login.dto';
import { User } from '../schemas/user.entity';
import { UsersAuthService } from './users-auth.service';
import { UsersService } from './users.service';

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
      ],
    }).compile();

    usersAuthService = module.get<UsersAuthService>(UsersAuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersAuthService).toBeDefined();
    expect(usersService).toBeDefined();
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
      expect(authorization.jwt_password).toBeDefined();
      expect(typeof authorization.jwt_password).toEqual('string');
    });
  });
});
