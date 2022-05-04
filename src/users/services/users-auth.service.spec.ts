import { Test, TestingModule } from '@nestjs/testing';
import { UsersAuthService } from './users-auth.service';

describe('UsersAuthService', () => {
  let usersAuthService: UsersAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersAuthService],
    }).compile();

    usersAuthService = module.get<UsersAuthService>(UsersAuthService);
  });

  it('should be defined', () => {
    expect(usersAuthService).toBeDefined();
  });
});
