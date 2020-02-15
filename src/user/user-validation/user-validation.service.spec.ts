import { Test, TestingModule } from '@nestjs/testing';
import { UserValidationService } from './user-validation.service';

describe('UserValidationService', () => {
  let service: UserValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserValidationService],
    }).compile();

    service = module.get<UserValidationService>(UserValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
