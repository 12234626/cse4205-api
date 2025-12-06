import { Test, TestingModule } from '@nestjs/testing';
import { ConsentRequestService } from './consent-request.service';

describe('ConsentRequestService', () => {
  let service: ConsentRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsentRequestService],
    }).compile();

    service = module.get<ConsentRequestService>(ConsentRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
