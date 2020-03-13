import { Test, TestingModule } from '@nestjs/testing';
import { TransferBaseService } from './transfer-base.service';

describe('TransferBaseService', () => {
  let service: TransferBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferBaseService],
    }).compile();

    service = module.get<TransferBaseService>(TransferBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
