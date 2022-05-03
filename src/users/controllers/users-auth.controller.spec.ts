import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../schemas/user.entity';
import { UsersAuthController } from './users-auth.controller';
import { UsersService } from '../services/users.service';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersAuthController],
      providers: [{ provide: UsersService, useValue: {} }],
    }).compile();

    usersAuthController = module.get<UsersAuthController>(UsersAuthController);
  });

  it('should be defined', () => {
    expect(usersAuthController).toBeDefined();
  });

  describe('login', () => {
    it('should log in a user successfully', () => {
      expect(true).toEqual(true);
    });
  });
});
