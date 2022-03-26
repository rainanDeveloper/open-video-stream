import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../schemas/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

const userList: User[] = [
  new User({
    id: 1,
    login: 'TheWretchedZoic',
    email: 'erdman.nova@oberbrunner.com',
    password: 'Q57YHtRDcJ8xZ6uTBSpih',
  }),
  new User({
    id: 2,
    login: 'HootPotatoes',
    email: 'schuppe.cara@yahoo.com',
    password: 'LJ2hxWAm67SBJaUpjCEsd',
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
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue(userList[0]),
            save: jest.fn().mockResolvedValue(userList[0]),
            findOne: jest.fn().mockResolvedValue(userList[0]),
            delete: jest.fn(),
          },
        },
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

  describe('create', () => {
    it('should crerate a user successfully', async () => {
      // Arrange
      const userDto: CreateUserDto = {
        login: 'Colossalmann',
        email: 'schmeler.lonie@hotmail.com',
        password: 'HZnFw4HX25PRTEVNDmrov',
      };

      // Act
      const result = await userService.create(userDto);

      // Assert
      expect(result).toEqual(userList[0]);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when save method on userRepository fails', () => {
      // Arrange
      const userDto: CreateUserDto = {
        login: 'EfficaciousPotatoes',
        email: 'joannie.rutherford@dickens.com',
        password: '28FhbdNNuuTxT57DDbzdZ',
      };

      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.create(userDto)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update successfully a user', async () => {
      // Arrange
      const updateUserDto: UpdateUserDto = {
        login: 'Yappystrom',
        email: 'wledner@bode.com',
        password: '3ryPb66Y4F5Ypq5cLVFKfp',
      };
      // Act
      const result = await userService.update(userList[0].id, updateUserDto);
      // Assert
      expect(result).toEqual(userList[0]);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('shoudl throw an error when method findOne on userRepository fails', () => {
      // Arrange
      const updateUserDto: UpdateUserDto = {
        login: 'fr4nk3lh1d30u5',
        email: 'vgrimes@west.com',
        password: '36WDxihke3k8ms5nxvLcBR',
      };

      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(
        userService.update(userList[0].id, updateUserDto),
      ).rejects.toThrowError();
    });

    it('should throw an error when method save on userRepository fails', () => {
      // Arrange
      const updateUserDto: UpdateUserDto = {
        login: 'FrankelTheWry',
        email: 'glennie.cronin@gmail.com',
        password: 'aEM7j4BT5kY6UjjNNwHUtJ',
      };

      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      // Assert
      expect(
        userService.update(userList[0].id, updateUserDto),
      ).rejects.toThrowError();
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an NotFoundException when the method findOne does not finds a user', () => {
      // Arrange
      const updateUserDto: UpdateUserDto = {
        login: 'Jitterystrom',
        email: 'vhintz@hirthe.com',
        password: 'eoAcqaGf8iMgVPM8j4Bn7N',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      // Assert
      expect(userService.update(userList[0].id, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should find a user', async () => {
      // Act
      const result = await userService.findOne(userList[0].id);
      // Assert
      expect(result).toEqual(userList[0]);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the method findOne on userRepository fails', () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.findOne(userList[0].id)).rejects.toThrowError();
    });

    it('should throw an NotFoundException when the method findOne does not finds a user', () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      // Assert
      expect(userService.findOne(userList[0].id)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      // Act
      await userService.delete(userList[0].id);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.delete).toHaveBeenCalledTimes(1);
    });
    it('should throw an error when the method findOne on userRepository fails', () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.delete(userList[0].id)).rejects.toThrowError();
    });
    it('should throw an error when method delete on userRepository fails', () => {
      // Arrange
      jest.spyOn(userRepository, 'delete').mockRejectedValueOnce(new Error());

      // Assert
      expect(userService.delete(userList[0].id)).rejects.toThrowError();
    });
    it('should throw a NotFoundException when method findOne on userRepository does not finds a user', () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      // Assert
      expect(userService.delete(userList[0].id)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
