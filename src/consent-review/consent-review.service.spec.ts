import { Test, TestingModule } from '@nestjs/testing';
import { ConsentReviewService } from './consent-review.service';

describe('ConsentReviewService', () => {
  let service: ConsentReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsentReviewService],
    }).compile();

    service = module.get<ConsentReviewService>(ConsentReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
