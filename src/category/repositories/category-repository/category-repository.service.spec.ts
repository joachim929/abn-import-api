import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepositoryService } from './category-repository.service';

describe('CategoryRepositoryService', () => {
  let service: CategoryRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryRepositoryService],
    }).compile();

    service = module.get<CategoryRepositoryService>(CategoryRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
