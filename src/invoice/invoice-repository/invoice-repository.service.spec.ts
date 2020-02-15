import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceRepositoryService } from './invoice-repository.service';

describe('InvoiceRepositoryService', () => {
  let service: InvoiceRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceRepositoryService],
    }).compile();

    service = module.get<InvoiceRepositoryService>(InvoiceRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
