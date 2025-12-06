import { Test, TestingModule } from '@nestjs/testing';
import { ConsentReviewController } from './consent-review.controller';
import { ConsentReviewService } from './consent-review.service';

describe('ConsentReviewController', () => {
  let controller: ConsentReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsentReviewController],
      providers: [ConsentReviewService],
    }).compile();

    controller = module.get<ConsentReviewController>(ConsentReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
