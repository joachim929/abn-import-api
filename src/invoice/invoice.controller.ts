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
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceDTO } from './dtos/invoice.dto';
import { CreateInvoiceDTO } from './dtos/create-invoice.dto';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {

  constructor(
    private service: InvoiceService,
  ) {
  }

  @Get()
  @UsePipes(new ParseIntPipe())
  @ApiResponse({
    status: 200, description: 'Found records', type: [InvoiceDTO],
  })
  @ApiResponse({
    status: 204, description: 'No content',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // When auth works
  })
  get(@Query('userId', new ParseIntPipe()) userId) {
    return this.service.getInvoices(userId).catch(reason => console.warn(reason));
  }

  @Patch()
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

  // todo: Implement this
  @Post('/upload/excel')
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
  @ApiBody({ type: [CreateInvoiceDTO] })
  importExcel(@Body() file: CreateInvoiceDTO[]) {
    return this.service.importInvoices('excel', file);
  }
}
