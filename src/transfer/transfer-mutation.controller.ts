import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransferImportService } from './services/transfer-import/transfer-import.service';
import { TransferSplitService } from './services/transfer-split/transfer-split.service';
import { TransferMutationService } from './services/transfer-mutation/transfer-mutation.service';
import { TransferMutation } from './entities/transfer-mutation.entity';
import { SplitTransferMutationDto } from './dtos/split-transfer-mutation.dto';
import { TransferMutationDTO } from './dtos/transfer-batch-import.dto';
import { Transfer } from './entities/transfer.entity';
import { TransferListParams } from './dtos/transfer-list-params.dto';

@ApiTags('TransferMutationApi')
@Controller('transfer-mutation')
export class TransferMutationController {
  constructor(
    private importService: TransferImportService,
    private splitService: TransferSplitService,
    private transferMutationService: TransferMutationService
  ) {
  }

  @Post('/category')
  @ApiOperation({
    operationId: 'getByCategoryId'
  })
  @ApiResponse({
    status: 200, type: TransferListParams
  })
  getTransferMutationsByCategoryId(@Body() body: TransferListParams) {
    return this.transferMutationService.getByCategoryId(body);
  }

  @Get('/history/:id')
  @ApiOperation({
    operationId: 'getTransferMutationHistory'
  })
  @ApiResponse({
    status: 200, description: 'Transfer Mutation history found', type: Transfer
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  getTransferMutationHistory(@Param('id', new ParseIntPipe()) id: number) {
    return this.transferMutationService.getTransferMutationHistory(id);
  }

  @Patch('/undo')
  @ApiOperation({
    operationId: 'undoTransferMutationPatch'
  })
  @ApiResponse({
    status: 200, description: 'Record patched', type: TransferMutationDTO
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  undoTransferMutationPatch(@Body() body: TransferMutationDTO) {
    return this.transferMutationService.undoTransferMutationPatch(body);
  }


  @Post('/split')
  @ApiOperation({
    operationId: 'splitTransferMutation',
  })
  @ApiResponse({
    status: 201, description: 'Record created and patched', type: [TransferMutationDTO],
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized',
  })
  splitTransferMutation(@Body() body: SplitTransferMutationDto) {
    return this.splitService.splitTransferMutation(body);
  }


  @Delete(':id')
  @ApiOperation({
    operationId: 'deleteTransferMutation',
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
    return this.transferMutationService.deleteMutation(id);
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getTransferMutation'
  })
  @ApiResponse({
    status: 200, description: 'Got records', type: TransferMutation
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  getTransferMutation(@Param('id', new ParseIntPipe()) id: number) {
    return this.transferMutationService.getOneMutation(id);
  }

  @Patch()
  @ApiOperation({
    operationId: 'patchTransferMutation'
  })
  @ApiResponse({
    status: 200, description: 'Record patched', type: TransferMutationDTO
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  patchTransferMutation(@Body() body: TransferMutationDTO) {
    return this.transferMutationService.patchTransferMutation(body);
  }
}
