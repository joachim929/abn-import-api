import { Test, TestingModule } from '@nestjs/testing';
import { RulesRepositoryService } from './rules-repository.service';

describe('RulesRepositoryService', () => {
  let service: RulesRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RulesRepositoryService],
    }).compile();

    service = module.get<RulesRepositoryService>(RulesRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
