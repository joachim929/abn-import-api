import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceDTO, UserIdDTO } from './dtos/invoice.dto';
import { CreateInvoiceDTO } from './dtos/create-invoice.dto';
import { isNumber } from 'util';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {

  constructor(
    private service: InvoiceService,
  ) {
  }

  @Get(':userId')
  @ApiOperation({
    operationId: 'getInvoicesForUser'
  })
  @ApiResponse({
    status: 200, description: 'Found records'
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
    operationId: 'patchInvoice'
  })
  @ApiResponse({
    status: 204, description: 'Record patched',
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  patch(@Body() invoice: CreateInvoiceDTO) {
    return this.service.patchInvoice(invoice).catch(reason => console.warn(reason));
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'deleteInvoice'
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
  delete(@Param('id', new ParseIntPipe()) id) {
    return this.service.deleteInvoice(id).catch(reason => console.warn(reason));
  }

  @Post()
  @ApiOperation({
    operationId: 'postInvoice'
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
    console.log(invoice);
    return this.service.createInvoice(invoice).catch(reason => console.warn(reason));
  }

  @Post('/multi')
  @ApiOperation({
    operationId: 'postInvoiceMulti'
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

  // todo: Implement this
  @Post('/upload/text')
  @ApiOperation({
    operationId: 'postInvoiceMultiText'
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({
    status: 201, description: 'Records created', // todo: Strong type
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  @ApiBody({ type: [CreateInvoiceDTO] })
  importText(@Body() file: CreateInvoiceDTO[]) {
    return this.service.importInvoices('text', file);
  }

  /**
   Beginsaldo: 601.83
   ​​
   Eindsaldo: 595.33
   ​​
   Muntsoort: "EUR"
   ​​
   Omschrijving: "BEA   NR:4ZJ201   13.02.20/07.52 Huiskamer KL 4804, WP,PAS043    WEESP"
   ​​
   Rekeningnummer: 523962118
   ​​
   Rentedatum: 20200213
   ​​
   Transactiebedrag: -6.5
   ​​
   Transactiedatum: 20200213
   */
  // todo: Implement this
  @Post('/upload/excel')
  @ApiOperation({
    operationId: 'postInvoiceMultiExcel'
  })
  @UsePipes(new ValidationPipe({ transform: true })) // todo: Will need a new DTO as the attribute names are different
  @ApiResponse({
    status: 201, description: 'Records created', // todo: Strong type
  })
  @ApiResponse({
    status: 400, description: 'Bad request',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // Not logged in
  })
  // @ApiBody({ })
  importExcel(@Body() file: CreateInvoiceDTO[]) {
    return this.service.importInvoices('excel', file);
  }
}
