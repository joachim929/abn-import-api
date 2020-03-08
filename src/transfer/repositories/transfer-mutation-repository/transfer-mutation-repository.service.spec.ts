import { Test, TestingModule } from '@nestjs/testing';
import { TransferMutationRepositoryService } from './transfer-mutation-repository.service';

describe('TransferMutationRepositoryService', () => {
  let service: TransferMutationRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferMutationRepositoryService],
    }).compile();

    service = module.get<TransferMutationRepositoryService>(TransferMutationRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
