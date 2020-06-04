import { Test, TestingModule } from '@nestjs/testing';
import { LogicRepositoryService } from './logic-repository.service';

describe('LogicRepositoryService', () => {
  let service: LogicRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogicRepositoryService],
    }).compile();

    service = module.get<LogicRepositoryService>(LogicRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
