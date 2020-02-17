import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Invoice } from './invoice.entity';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceDTO } from './dtos/invoice.dto';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(
    private service: InvoiceService,
  ) {
  }

  @Get()
  @ApiResponse({
    status: 200, description: 'Found records', type: [InvoiceDTO]
  })
  get(@Query() query) {
    return this.service.getInvoices(query.userId).catch(reason => console.warn(reason));
  }

  @Patch(':id')
  @ApiBody({type: Invoice})
  @ApiResponse({
    status: 204, description: 'Record patched'
  })
  patch(@Body() invoice: Invoice) {
    return this.service.patchInvoice(invoice).catch(reason => console.warn(reason));
  }

  @Delete(':id')
  @ApiResponse({
    status: 204, description: 'Record deleted'
  })
  delete(@Param() params) {
    return this.service.deleteInvoice(params.id).catch(reason => console.warn(reason));
  }

  @Post()
  @ApiResponse({
    status: 200, description: 'Record created', type: InvoiceDTO
  })
  create(@Body() invoice: Invoice) {
    return this.service.createInvoice(invoice).catch(reason => console.warn(reason));
  }

  @Post('/multi')
  @ApiResponse({
    status: 200, description: 'Records created', type: [InvoiceDTO]
  })
  @ApiBody({type: [Invoice]})
  createMulti(@Body() invoices: Invoice[]) {
    return this.service.createInvoices(invoices);
  }
}
