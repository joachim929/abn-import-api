import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RulesService } from './rules.service';
import { Rule } from './rule.entity';

@Controller('rules')
export class RulesController {
  constructor(private service: RulesService) {
  }

  @Get(':id')
  get(@Param() params) {
    return this.service.getRule(params.id).catch(reason => console.warn(reason));
  }

  @Get()
  getAll() {
    return this.service.getAll().catch(reason => console.warn(reason));
  }

  @Patch(':id')
  patch(@Body() rule: Rule) {
    return this.service.patchRule(rule).catch(reason => console.warn(reason));
  }

  @Delete(':id')
  delete(@Param() params) {
    return this.service.deleteRule(params.id).catch(reason => console.warn(reason));
  }

  @Post()
  create(@Body() rules: Rule[]) {
    return this.service.createRules(rules).catch(reason => console.warn(reason));
  }
}
