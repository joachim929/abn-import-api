import { Test, TestingModule } from '@nestjs/testing';
import { TransferMutationService } from './transfer-mutation.service';

describe('TransferMutationService', () => {
  let service: TransferMutationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferMutationService],
    }).compile();

    service = module.get<TransferMutationService>(TransferMutationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
