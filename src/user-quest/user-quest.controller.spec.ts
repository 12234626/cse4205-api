import { Test, TestingModule } from '@nestjs/testing';
import { UserQuestController } from './user-quest.controller';
import { UserQuestService } from './user-quest.service';

describe('UserQuestController', () => {
  let controller: UserQuestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserQuestController],
      providers: [UserQuestService],
    }).compile();

    controller = module.get<UserQuestController>(UserQuestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
