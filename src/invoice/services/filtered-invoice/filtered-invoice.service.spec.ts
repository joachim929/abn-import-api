import { Test, TestingModule } from '@nestjs/testing';
import { FilteredInvoiceService } from './filtered-invoice.service';

describe('FilteredInvoiceService', () => {
  let service: FilteredInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilteredInvoiceService],
    }).compile();

    service = module.get<FilteredInvoiceService>(FilteredInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
