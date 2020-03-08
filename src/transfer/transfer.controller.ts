import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransferService } from './services/transfer.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RawInvoiceJsonDTO } from '../invoice/dtos/raw-invoice-json.dto';

@ApiTags('TransferApi')
@Controller('transfer')
export class TransferController {
  constructor(
    private service: TransferService,
  ) {
  }

  @Get()
  @ApiOperation({
    operationId: 'getTransactions',
  })
  get() {
    return this.service.getDebug();
  }

  @Post('upload/excel')
  @ApiOperation({
    operationId: 'postInvoiceMultiExcel',
  })
  @ApiBody({ type: [RawInvoiceJsonDTO] })
  postExcel(@Body() transfer: [RawInvoiceJsonDTO]) {
    return this.service.postMultiExcel(transfer);
  }
}
