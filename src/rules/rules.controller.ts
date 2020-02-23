import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RulesService } from './rules.service';
import { Rule } from './rule.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RuleDTO } from './dtos/rule.dto';

@ApiTags('RulesApi')
@Controller('rules')
export class RulesController {
  constructor(private service: RulesService) {
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getRuleById',
  })
  @ApiResponse({
    status: 200, description: 'The found record', type: RuleDTO,
  })
  @ApiResponse({
    status: 204, description: 'No content' // When nothing found
  })
  @ApiResponse({
    status: 403, description: 'Forbidden' // When auth works
  })
  @ApiResponse({
    status: 422, description: 'Unprocessable Entity' // Invalid param
  })
  get(@Param() params) {
    return this.service.getRule(params.id).catch(reason => console.warn(reason));
  }

  @Get()
  @ApiOperation({
    operationId: 'getAllRules',
  })
  @ApiResponse({
    status: 200, description: 'The found records', type: [RuleDTO],
  })
  @ApiResponse({
    status: 204, description: 'No content' // When nothing found
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized' // When auth works
  })
  getAll() {
    return this.service.getAll().catch(reason => console.warn(reason));
  }

  @Patch(':id')
  @ApiOperation({
    operationId: 'patchRule',
  })
  @ApiResponse({
    status: 204, description: 'Record patched'
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized' // When auth works, not logged in
  })
  @ApiResponse({
    status: 403, description: 'Forbidden' // When auth works, not user rule
  })
  @ApiResponse( {
    status: 422, description: 'Unprocessable Entity' // Invalid params
  })
  patch(@Body() rule: Rule) {
    return this.service.patchRule(rule).catch(reason => console.warn(reason));
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'deleteRule',
  })
  @ApiResponse({
    status: 204, description: 'Record deleted'
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized' // When auth works, not logged in
  })
  @ApiResponse({
    status: 403, description: 'Unauthorized' // When not user's rule
  })
  @ApiResponse({
    status: 422, description: 'Unprocessable Entity' // Invalid params
  })
  delete(@Param() params) {
    return this.service.deleteRule(params.id).catch(reason => console.warn(reason));
  }

  @Post()
  @ApiOperation({
    operationId: 'createRule',
  })
  @ApiResponse({
    status: 201, description: 'Record created', type: RuleDTO,
  })
  @ApiResponse({
    status: 401, description: 'Forbidden' // When not logged in
  })
  @ApiResponse({
    status: 422, description: 'Unprocessable Entity' // Invalid params
  })
  create(@Body() rules: Rule[]) {
    return this.service.createRules(rules).catch(reason => console.warn(reason));
  }
}
