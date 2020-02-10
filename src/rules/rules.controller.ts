import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RulesService } from './rules.service';
import { Rule } from './rule.entity';

@Controller('api/rules')
export class RulesController {
  constructor(private service: RulesService) {
  }

  @Get(':id')
  get(@Param() params) {
    return 'WIP';
    // return this.service.getRule(params.id);
  }

  @Patch(':id')
  patch(@Body() rule: Rule) {
    return this.service.patchRule(rule);
  }

  @Delete(':id')
  delete(@Param() params) {
    return 'WIP';
  }

  @Post()
  create(@Body() rule: Rule) {
    return 'WIP';
  }
}
