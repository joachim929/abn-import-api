import { Test, TestingModule } from '@nestjs/testing';
import { TransferMutationController } from './transfer-mutation.controller';

describe('TransferMutation Controller', () => {
  let controller: TransferMutationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferMutationController],
    }).compile();

    controller = module.get<TransferMutationController>(TransferMutationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
