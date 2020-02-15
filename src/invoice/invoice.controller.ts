import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Invoice } from './invoice.entity';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private service: InvoiceService,
  ) {
  }

  @Get()
  get(@Query() query) {
    return this.service.getInvoices(query.userId).catch(reason => console.warn(reason));
  }

  @Patch(':id')
  patch(@Body() invoice: Invoice) {
    return this.service.patchInvoice(invoice).catch(reason => console.warn(reason));
  }

  @Delete(':id')
  delete(@Param() params) {
    return this.service.deleteInvoice(params.id).catch(reason => console.warn(reason));
  }

  @Post()
  create(@Body() invoice: Invoice) {
    return this.service.createInvoice(invoice).catch(reason => console.warn(reason));
  }
}
