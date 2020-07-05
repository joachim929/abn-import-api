import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { TransferService } from './services/transfer.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RawInvoiceJsonDTO, RawTransferSerializerDTO } from '../shared/dtos/raw-invoice-json.dto';
import { TransferImportService } from './services/transfer-import.service';
import { TransferBatchImportDto, TransferMutationDTO } from './dtos/transfer-batch-import.dto';
import { TransferMutation } from './entities/transfer-mutation.entity';
import { TransferListParams } from './dtos/transfer-list-params.dto';
import { Transfer } from './entities/transfer.entity';

@ApiTags('TransferApi')
@Controller('transfer')
export class TransferController {
  constructor(
    private service: TransferService,
    private importService: TransferImportService,
  ) {
  }

  /**
   * Debug/Admin route to get all data
   */
  @Get()
  @ApiResponse({
    status: 200, description: 'Get all transfers', type: [Transfer],
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
  @ApiResponse({
    status: 200, description: 'Got records', type: TransferMutation,
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  getTransfer(@Param('id') id: string) {
    return this.service.getTransfer(id);
  }

  @Post('/filtered')
  @ApiResponse({
    status: 201, description: 'Got records', type: TransferListParams,
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized',
  })
  getFilteredTransfers(@Body() body: TransferListParams) {
    return this.service.getFilteredTransfers(body);
  }

  @Post('upload/excel')
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

  @Post('upload/existing')
  @ApiResponse({
    status: 201, type: [TransferMutationDTO],
  })
  @ApiResponse({
    status: 400,
  })
  @ApiResponse({
    status: 401,
  })
  @ApiBody({ type: [RawTransferSerializerDTO] })
  postExisting(@Body() existing: [RawTransferSerializerDTO]) {
    return this.importService.postExisting(existing);
  }
}
