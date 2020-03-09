import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TransferService } from './services/transfer.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RawInvoiceJsonDTO } from '../invoice/dtos/raw-invoice-json.dto';
import { InvoiceDTO } from '../invoice/dtos/invoice.dto';
import { TransferImportService } from './services/transfer-import/transfer-import.service';

@ApiTags('TransferApi')
@Controller('transfer')
export class TransferController {
  constructor(
    private service: TransferService,
    private importService: TransferImportService
  ) {
  }

  @Get()
  @ApiOperation({
    operationId: 'getTransactions',
  })
  get() {
    return this.service.getTransfersWithMutations();
  }

  @Patch()
  @ApiOperation({
    operationId: 'patchTransfer',
  })
  @ApiResponse({
    status: 200, description: 'Transfer patched', type: InvoiceDTO,
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  patch(@Body() body) {
    return 'patchTransfer WIP';
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'Transfer deleted',
  })
  @ApiResponse({
    status: 204, description: 'Record deleted',
  })
  @ApiResponse({
    status: 400, description: 'Bad request', // Id doesn't exist
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  delete(@Param('id', new ParseIntPipe()) id: number) {
    return 'delete WIP';
  }

  @Post('/filtered')
  @ApiOperation({
    operationId: 'filteredTransfers',
  })
  @ApiResponse({
    status: 201, description: 'Got records',
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  getFilteredTransfers(@Body() body) {
    return 'filteredTransfers WIP';
  }

  @Post('/split')
  @ApiOperation({
    operationId: 'splitTransfer',
  })
  @ApiResponse({
    status: 201, description: 'Record created and patched',
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized',
  })
  splitTransfer(@Body() body) {
    return 'splitTransfer wip';
  }

  /**
   * todo:
   *  Create DTO
   *  If duplicate, return as feedback and confirmation
   */
  @Post('upload/excel')
  @ApiOperation({
    operationId: 'postInvoiceMultiExcel',
  })
  @ApiResponse({
    status: 201, description: 'Records created', // todo: Create return DTO
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized',
  })
  @ApiBody({ type: [RawInvoiceJsonDTO] })
  postExcel(@Body() transfer: [RawInvoiceJsonDTO]) {
    return this.importService.postMultiExcel(transfer);
  }
}
