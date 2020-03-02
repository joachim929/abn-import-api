import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceDTO } from './dtos/invoice.dto';
import { CreateInvoiceDTO } from './dtos/create-invoice.dto';
import { PostInvoiceService } from './services/post-invoice/post-invoice.service';
import { RawInvoiceJsonDTO } from './dtos/raw-invoice-json.dto';
import { SplitInvoiceDTO } from './dtos/split-invoice.dto';
import { SplitInvoiceService } from './services/split-invoice/split-invoice.service';

@ApiTags('InvoiceApi')
@Controller('invoice')
export class InvoiceController {

  constructor(
    private service: InvoiceService,
    private postInvoiceService: PostInvoiceService,
    private splitInvoiceService: SplitInvoiceService,
  ) {
  }

  @Get(':userId')
  @ApiOperation({
    operationId: 'getInvoicesForUser',
  })
  @ApiResponse({
    status: 200, description: 'Found records', type: [InvoiceDTO],
  })
  @ApiResponse({
    status: 204, description: 'No content',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // When auth works
  })
  get(@Param('userId', new ParseIntPipe()) userId: number) {
    return this.service.getInvoices(userId).catch(reason => console.warn(reason));
  }

  @Patch()
  @ApiOperation({
    operationId: 'patchInvoice',
  })
  @ApiResponse({
    status: 200, description: 'Record patched', type: InvoiceDTO
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  patch(@Body() body: CreateInvoiceDTO) {
    return this.service.patchInvoice(body).catch(reason => console.warn(reason));
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'deleteInvoice',
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
    return this.service.deleteInvoice(id).catch(reason => console.warn(reason));
  }

  @Post()
  @ApiOperation({
    operationId: 'postInvoice',
  })
  @UsePipes(new ValidationPipe({
    transform: true,
  }))
  @ApiResponse({
    status: 201, description: 'Record created', type: InvoiceDTO,
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  create(@Body() invoice: CreateInvoiceDTO) {
    return this.service.createInvoice(invoice).catch(reason => console.warn(reason));
  }

  @Post('/split')
  @ApiOperation({
    operationId: 'splitInvoice',
  })
  @ApiResponse({
    status: 201, description: 'Record created and patched', type: SplitInvoiceDTO
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized',
  })
  split(@Body() body: SplitInvoiceDTO) {
    return this.splitInvoiceService.splitInvoice(body).catch(reason => console.warn(reason));
  }

  @Post('/multi')
  @ApiOperation({
    operationId: 'postInvoiceMulti',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({
    status: 201, description: 'Records created', type: [InvoiceDTO],
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  @ApiBody({ type: [CreateInvoiceDTO] })
  createMulti(@Body() invoices: CreateInvoiceDTO[]) {
    return this.service.createInvoices(invoices);
  }

  @Post('/upload/text')
  @ApiOperation({
    operationId: 'postInvoiceMultiText',
  })
  @ApiResponse({
    status: 201, description: 'Records created', type: [InvoiceDTO],
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  importText(@Body() file: RawInvoiceJsonDTO[]) {
    return this.service.importInvoices('text', this.postInvoiceService.serializeRawJson(file));
  }

  @Post('/upload/excel')
  @ApiOperation({
    operationId: 'postInvoiceMultiExcel',
  })
  @ApiResponse({
    status: 201, description: 'Records created', type: [InvoiceDTO],
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  importExcel(@Body() file: RawInvoiceJsonDTO[]) {
    console.log(file);
    return this.service.importInvoices('excel', this.postInvoiceService.serializeRawJson(file));
  }
}
