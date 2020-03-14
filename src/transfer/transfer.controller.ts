import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { TransferService } from './services/transfer.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RawInvoiceJsonDTO } from '../invoice/dtos/raw-invoice-json.dto';
import { TransferImportService } from './services/transfer-import/transfer-import.service';
import { TransferBatchImportDto, TransferMutationDTO } from './dtos/transfer-batch-import.dto';
import { TransferMutation } from './entities/transfer-mutation.entity';
import { TransferListParams } from './dtos/transfer-list-params.dto';

@ApiTags('TransferApi')
@Controller('transfer')
export class TransferController {
  constructor(
    private service: TransferService,
    private importService: TransferImportService,
  ) {
  }

  @Get()
  @ApiOperation({
    operationId: 'getTransfer',
  })
  @ApiResponse({
    status: 200, description: 'Get all transfers', type: [TransferMutationDTO],
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  get() {
    return this.service.getTransfersWithMutations();
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getTransfer',
  })
  @ApiResponse({
    status: 201, description: 'Got records', type: TransferMutation,
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  getTransfer(@Param('id') id: string) {
    return this.service.getTransfer(id);
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
  delete(@Param('id') id: string) {
    return this.service.deleteTransfer(id);
  }

  /**
   * todo: See invoices
   */
  @Post('/filtered')
  @ApiOperation({
    operationId: 'filteredTransfers',
  })
  @ApiResponse({
    status: 201, description: 'Got records', type: TransferListParams
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized',
  })
  getFilteredTransfers(@Body() body: TransferListParams) {
    console.log('controller');
    return this.service.getFilteredTransfers(body);
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
  postExcelImport(@Body() transfer: [RawInvoiceJsonDTO]) {
    return this.importService.postExcelImport(transfer);
  }
}
