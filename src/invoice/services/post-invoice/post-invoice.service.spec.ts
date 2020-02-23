import { Test, TestingModule } from '@nestjs/testing';
import { PostInvoiceService } from './post-invoice.service';

describe('PostInvoiceService', () => {
  let service: PostInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostInvoiceService],
    }).compile();

    service = module.get<PostInvoiceService>(PostInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
