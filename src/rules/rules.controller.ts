import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RulesService } from './rules.service';
import { Rule } from './rule.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RuleDTO } from './dtos/rule.dto';

@ApiTags('Rules')
@Controller('rules')
export class RulesController {
  constructor(private service: RulesService) {
  }

  @Get(':id')
  @ApiResponse({
    status: 200, description: 'The found record', type: RuleDTO,
  })
  get(@Param() params) {
    return this.service.getRule(params.id).catch(reason => console.warn(reason));
  }

  @Get()
  @ApiResponse({
    status: 200, description: 'The found records', type: [RuleDTO],
  })
  getAll() {
    return this.service.getAll().catch(reason => console.warn(reason));
  }

  @Patch(':id')
  @ApiResponse({
    status: 204, description: 'Record patched'
  })
  patch(@Body() rule: Rule) {
    return this.service.patchRule(rule).catch(reason => console.warn(reason));
  }

  @Delete(':id')
  @ApiResponse({
    status: 204, description: 'Record deleted'
  })
  delete(@Param() params) {
    return this.service.deleteRule(params.id).catch(reason => console.warn(reason));
  }

  @Post()
  @ApiResponse({
    status: 200, description: 'Record created', type: RuleDTO,
  })
  create(@Body() rules: Rule[]) {
    return this.service.createRules(rules).catch(reason => console.warn(reason));
  }
}
