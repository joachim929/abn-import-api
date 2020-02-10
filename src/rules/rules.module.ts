import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rule])],
  providers: [RulesService],
  controllers: [RulesController],
})
export class RulesModule {
}
