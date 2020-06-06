import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './services/rules.service';
import { LogicRepositoryService } from './repositories/logic-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferCondition } from './entities/transfer-condition.entity';
import { Logic } from './entities/logic.entity';
import { CategoryModule } from '../category/category.module';
import { LogicService } from './services/logic.service';
import { LogicController } from './logic.controller';
import { TransferConditionRepositoryService } from './repositories/transfer-condition-repository.service';

@Module({
  imports: [
    CategoryModule,
    TypeOrmModule.forFeature([ TransferCondition, Logic]),
  ],
  controllers: [RulesController, LogicController],
  providers: [RulesService, LogicRepositoryService, LogicService, TransferConditionRepositoryService],
})
export class RulesModule {
}
