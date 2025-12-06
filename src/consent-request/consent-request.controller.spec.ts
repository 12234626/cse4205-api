import { Test, TestingModule } from '@nestjs/testing';
import { ConsentRequestController } from './consent-request.controller';
import { ConsentRequestService } from './consent-request.service';

describe('ConsentRequestController', () => {
  let controller: ConsentRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsentRequestController],
      providers: [ConsentRequestService],
    }).compile();

    controller = module.get<ConsentRequestController>(ConsentRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
