import { Test, TestingModule } from '@nestjs/testing';
import { AmountRepositoryService } from './amount-repository.service';

describe('AmountRepositoryService', () => {
  let service: AmountRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmountRepositoryService],
    }).compile();

    service = module.get<AmountRepositoryService>(AmountRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
