import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './rule.entity';
import { RulesRepositoryService } from './rules-repository/rules-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rule])],
  providers: [RulesService, RulesRepositoryService],
  controllers: [RulesController],
})
export class RulesModule {
}
