import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransferCondition } from './entities/transfer-condition.entity';

@ApiTags('RulesApi')
@Controller('rules')
export class RulesController {

  @Get()
  @ApiResponse({
    status: 200, type: [TransferCondition],
  })
  get() {
    return 'WIP';
  }

  @Post()
  @ApiResponse({
    status: 201, type: TransferCondition,
  })
  post(@Body() transferCondition: TransferCondition) {
    return 'WIP';
  }

  @Patch('id')
  @ApiResponse({
    status: 201, type: TransferCondition,
  })
  patch(@Param('id') id: string, @Body() transferCondition: TransferCondition) {
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
