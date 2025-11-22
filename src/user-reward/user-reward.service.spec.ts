import { Test, TestingModule } from '@nestjs/testing';
import { UserRewardService } from './user-reward.service';

describe('UserRewardService', () => {
  let service: UserRewardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRewardService],
    }).compile();

    service = module.get<UserRewardService>(UserRewardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
