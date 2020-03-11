import { Test, TestingModule } from '@nestjs/testing';
import { TransferSplitService } from './transfer-split.service';

describe('TransferSplitService', () => {
  let service: TransferSplitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferSplitService],
    }).compile();

    service = module.get<TransferSplitService>(TransferSplitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
