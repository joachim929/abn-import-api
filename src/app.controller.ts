import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { EnumDTO } from './shared/dtos/enum.dto';

@ApiTags('AppApi')
@Controller()
export class AppController {
  @Get('enums')
  @ApiResponse({
    status: 200, type: EnumDTO
  })
  @ApiResponseProperty()
  getEnums() {
    return new EnumDTO();
  }
}
