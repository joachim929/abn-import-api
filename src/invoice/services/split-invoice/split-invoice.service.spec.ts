import { Test, TestingModule } from '@nestjs/testing';
import { SplitInvoiceService } from './split-invoice.service';

describe('SplitInvoiceService', () => {
  let service: SplitInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SplitInvoiceService],
    }).compile();

    service = module.get<SplitInvoiceService>(SplitInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
