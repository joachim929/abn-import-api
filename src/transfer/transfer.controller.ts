import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TransferService } from './services/transfer.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RawInvoiceJsonDTO } from '../invoice/dtos/raw-invoice-json.dto';
import { InvoiceDTO } from '../invoice/dtos/invoice.dto';
import { TransferImportService } from './services/transfer-import/transfer-import.service';
import { TransferBatchImportDto } from './dtos/transfer-batch-import.dto';
import { Transfer } from './entities/transfer.entity';
import { TransferSplitService } from './services/transfer-split/transfer-split.service';

@ApiTags('TransferApi')
@Controller('transfer')
export class TransferController {
  constructor(
    private service: TransferService,
    private importService: TransferImportService,
    private splitService: TransferSplitService
  ) {
  }

  @Get()
  @ApiOperation({
    operationId: 'getTransfer',
  })
  @ApiResponse({
    status: 200, description: 'Get all transfers', type: [Transfer],
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
    operationId: 'deleteTransfer',
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
    return this.splitService.splitTransfer(body);
  }

  @Post('upload/excel')
  @ApiOperation({
    operationId: 'postExcelTransfer',
  })
  @ApiResponse({
    status: 201, description: 'Records created', type: TransferBatchImportDto,
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized',
  })
  @ApiBody({ type: [RawInvoiceJsonDTO] })
  postExcelTest(@Body() transfer: [RawInvoiceJsonDTO]) {
    return this.importService.postExcelImport(transfer);
  }
}
