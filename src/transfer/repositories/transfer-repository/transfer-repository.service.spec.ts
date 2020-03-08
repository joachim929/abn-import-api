import { Test, TestingModule } from '@nestjs/testing';
import { TransferRepositoryService } from './transfer-repository.service';

describe('TransferRepositoryService', () => {
  let service: TransferRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferRepositoryService],
    }).compile();

    service = module.get<TransferRepositoryService>(TransferRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
