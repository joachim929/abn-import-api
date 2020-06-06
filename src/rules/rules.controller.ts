import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RulesService } from './services/rules.service';
import { CreateTransferConditionDto } from './dtos/create-transfer-condition.dto';
import { TransferConditionDTO } from './dtos/transfer-condition.dto';

@ApiTags('RulesApi')
@Controller('rules')
export class RulesController {
  constructor(private service: RulesService) {
  }

  @Get(':id')
  @ApiResponse({
    status: 200, type: [TransferConditionDTO],
  })
  get(@Param('id') id: string) {
    return this.service.getWithRelationsShips(id);
  }

  @Post()
  @ApiResponse({
    status: 201, type: TransferConditionDTO,
  })
  post(@Body() transferCondition: CreateTransferConditionDto) {
    return this.service.post(transferCondition);
  }

  @Patch('id')
  @ApiResponse({
    status: 201, type: TransferConditionDTO,
  })
  patch(@Param('id') id: string, @Body() transferCondition: TransferConditionDTO) {
    return 'WIP';
  }

  @Delete('id')
  @ApiResponse({
    status: 204
  })
  delete(@Param('id') id: string) {
    return 'WIP';
  }
}
