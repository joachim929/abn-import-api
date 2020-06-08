import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RulesService } from './services/rules.service';
import { CreateTransferConditionDTO } from './dtos/create-transfer-condition.dto';
import { TransferConditionDTO } from './dtos/transfer-condition.dto';

@ApiTags('RulesApi')
@Controller('rules')
export class RulesController {
  constructor(private service: RulesService) {
  }

  @Get()
  @ApiResponse({
    status: 200, type: [TransferConditionDTO]
  })
  getAll() {
    return this.service.getAll();
  }

  @Patch()
  @ApiResponse({
    status: 201, type: TransferConditionDTO,
  })
  patch(@Body() transferCondition: TransferConditionDTO) {
    return this.service.patch(transferCondition);
  }

  @Get(':id')
  @ApiResponse({
    status: 200, type: TransferConditionDTO,
  })
  get(@Param('id') id: string) {
    return this.service.getWithRelationsShips(id);
  }

  @Post()
  @ApiResponse({
    status: 201, type: TransferConditionDTO,
  })
  post(@Body() transferCondition: CreateTransferConditionDTO) {
    return this.service.post(transferCondition);
  }

  @Delete('id')
  @ApiResponse({
    status: 204
  })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
