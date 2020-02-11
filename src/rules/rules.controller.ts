import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RulesService } from './rules.service';
import { Rule } from './rule.entity';

@Controller('api/rules')
export class RulesController {
  constructor(private service: RulesService) {
  }

  @Get(':id')
  get(@Param() params) {
    return this.service.getRule(params.id);
  }

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Patch(':id')
  patch(@Body() rule: Rule) {
    return this.service.patchRule(rule);
  }

  @Delete(':id')
  delete(@Param() params) {
    return this.service.deleteRule(params.id).catch(reason => console.warn(reason));
  }

  @Post()
  create(@Body() rule: Rule) {
    return this.service.createRule(rule).catch(reason => console.warn(reason));
  }
}
