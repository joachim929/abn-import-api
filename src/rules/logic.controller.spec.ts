import { Test, TestingModule } from '@nestjs/testing';
import { LogicController } from './logic.controller';

describe('Logic Controller', () => {
  let controller: LogicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogicController],
    }).compile();

    controller = module.get<LogicController>(LogicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
