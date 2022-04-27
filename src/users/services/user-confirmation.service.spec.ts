import { Test, TestingModule } from '@nestjs/testing';
import { UserConfirmationService } from './user-confirmation.service';
import { User } from '../schemas/user.entity';
import { UserOtgCode } from '../schemas/user-otg-code.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserOtgCodeDto } from '../dto/create-user-otg-code.dto';
import { NotFoundException } from '@nestjs/common';

const userList: User[] = [
  new User({
    id: 1,
    login: 'Strawberryoff',
    email: 'ullrich.lottie@hotmail.com',
    password: 'PaGPtrDwUM6snMBtngP',
  }),
  new User({
    id: 2,
    login: 'Defiantstein',
    email: 'bechtelar.edwin@gmail.com',
    password: 'Bwy48UejNoA7CAkG9WSQFY3MHkS8aM',
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

describe('UserConfirmationService', () => {
  let userConfirmationService: UserConfirmationService;
  let userOtgCodeRepository: Repository<UserOtgCode>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserConfirmationService,
        {
          provide: getRepositoryToken(UserOtgCode),
          useValue: {
            create: jest.fn().mockReturnValue(userOtgCodeList[0]),
            save: jest.fn().mockResolvedValue(userOtgCodeList[0]),
            findOne: jest.fn().mockResolvedValue(userOtgCodeList[0]),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    userConfirmationService = module.get<UserConfirmationService>(
      UserConfirmationService,
    );
    userOtgCodeRepository = module.get<Repository<UserOtgCode>>(
      getRepositoryToken(UserOtgCode),
    );
  });

  it('should be defined', () => {
    expect(userConfirmationService).toBeDefined();
    expect(userOtgCodeRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a UserOtgCode successfully', async () => {
      // Arrange
      const userOtgDto: CreateUserOtgCodeDto = {
        email: userList[0].email,
        user: userList[0],
      };
      // Act
      const otgCode = await userConfirmationService.create(userOtgDto);
      // Assert
      expect(otgCode).toEqual(userOtgCodeList[0]);
      expect(userOtgCodeRepository.create).toHaveBeenCalledTimes(1);
      expect(userOtgCodeRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method "save" on "userOtgCodeRepository" fails', () => {
      // Arrange
      const userOtgDto: CreateUserOtgCodeDto = {
        email: userList[0].email,
        user: userList[0],
      };

      jest
        .spyOn(userOtgCodeRepository, 'save')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(userConfirmationService.create(userOtgDto)).rejects.toThrowError();
      expect(userOtgCodeRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateOtgCode', () => {
    it('should update a record successfully', async () => {
      // Act
      const otgCodeUpdated = await userConfirmationService.updateOtgCode(
        userList[0].email,
      );

      // Assert
      expect(otgCodeUpdated).toEqual(userOtgCodeList[0]);
      expect(userOtgCodeRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userOtgCodeRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method "save" on "userOtgCodeRepository" fails', () => {
      // Arrange
      jest
        .spyOn(userOtgCodeRepository, 'save')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(
        userConfirmationService.updateOtgCode(userOtgCodeList[0].email),
      ).rejects.toThrowError();
      expect(userOtgCodeRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneByEmail', () => {
    it('should find a otg code by email successfully', async () => {
      // Act
      const otgCode = await userConfirmationService.findOneByEmail(
        userOtgCodeList[0].email,
      );

      // Assert
      expect(otgCode).toEqual(userOtgCodeList[0]);
      expect(userOtgCodeRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should throw an NotFoundException when method "findOne" on "userOtgCodeRepository" fails', () => {
      // Arrange
      jest.spyOn(userOtgCodeRepository, 'findOne').mockResolvedValue(null);
      // Assert
      expect(
        userConfirmationService.updateOtgCode(userOtgCodeList[0].email),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteOtgCode', () => {
    it('should delete a otgCode successfully', async () => {
      // Act
      await userConfirmationService.delete(userOtgCodeList[0].email);

      // Assert
      expect(userOtgCodeRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userOtgCodeRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when method "delete" on "userOtgCodeRepository" fails', () => {
      // Arrange
      jest
        .spyOn(userOtgCodeRepository, 'delete')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(userConfirmationService.delete).rejects.toThrowError();
    });
  });
});
