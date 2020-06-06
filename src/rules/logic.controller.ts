import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogicService } from './services/logic.service';
import { LogicDTO } from './dtos/logic.dto';

@ApiTags('LogicApi')
@Controller('logic')
export class LogicController {
  constructor(private service: LogicService) {

  }

  @Get()
  @ApiResponse({
    status: 200, type: [LogicDTO]
  })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200, type: LogicDTO,
  })
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  @ApiResponse({
    status: 201, type: LogicDTO,
  })
  post(@Body() logic: LogicDTO) {
    return this.service.post(logic);
  }

  @Patch()
  @ApiResponse({
    status: 201, type: LogicDTO,
  })
  patch(@Body() logic: LogicDTO) {
    return this.service.patch(logic);
  }

  @Delete(':id')
  @ApiResponse({
    status: 204
  })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
