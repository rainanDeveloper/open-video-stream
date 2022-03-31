import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../schemas/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

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

describe('UsersController', () => {
  let userController: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(userList[0]),
          },
        },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
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
    });
  });
});
