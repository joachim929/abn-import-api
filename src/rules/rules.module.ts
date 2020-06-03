import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './services/rules.service';
import { RulesRepositoryService } from './repositories/rules-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferCondition } from './entities/transfer-condition.entity';
import { Logic } from './entities/logic.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    CategoryModule,
    TypeOrmModule.forFeature([ TransferCondition, Logic]),
  ],
  controllers: [RulesController],
  providers: [RulesService, RulesRepositoryService],
})
export class RulesModule {
}
