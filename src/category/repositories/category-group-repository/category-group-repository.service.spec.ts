import { Test, TestingModule } from '@nestjs/testing';
import { CategoryGroupRepositoryService } from './category-group-repository.service';

describe('CategoryGroupRepositoryService', () => {
  let service: CategoryGroupRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryGroupRepositoryService],
    }).compile();

    service = module.get<CategoryGroupRepositoryService>(CategoryGroupRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
