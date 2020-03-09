import { Test, TestingModule } from '@nestjs/testing';
import { TransferImportService } from './transfer-import.service';

describe('TransferImportService', () => {
  let service: TransferImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferImportService],
    }).compile();

    service = module.get<TransferImportService>(TransferImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
