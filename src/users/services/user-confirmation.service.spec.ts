import { Test, TestingModule } from '@nestjs/testing';
import { UserConfirmationService } from './user-confirmation.service';

describe('UserConfirmationService', () => {
  let userConfirmationService: UserConfirmationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserConfirmationService],
    }).compile();

    userConfirmationService = module.get<UserConfirmationService>(
      UserConfirmationService,
    );
  });

  it('should be defined', () => {
    expect(userConfirmationService).toBeDefined();
  });
});
