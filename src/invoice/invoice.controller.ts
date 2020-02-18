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
import { Invoice } from './invoice.entity';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceDTO } from './dtos/invoice.dto';
import { CreateInvoiceDTO } from './dtos/create-invoice.dto'

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {

  // todo:  read up on https://github.com/typestack/class-validator
  constructor(
    private service: InvoiceService,
  ) {
  }

  @Get()
  @ApiResponse({
    status: 200, description: 'Found records', type: [InvoiceDTO]
  })
  @ApiResponse({
    status: 204, description: 'No content'
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized' // When auth works
  })
  @ApiResponse({
    status: 422, description: 'Unprocessable Entity' // Invalid id
  })
  get(@Query() query) {
    return this.service.getInvoices(query.userId).catch(reason => console.warn(reason));
  }

  @Patch(':id')
  @ApiBody({type: Invoice})
  @ApiResponse({
    status: 204, description: 'Record patched', type: null
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized' // Not logged in
  })
  @ApiResponse({
    status: 422, description: 'Unprocessable Entity'
  })
  patch(@Body() invoice: Invoice) {
    return this.service.patchInvoice(invoice).catch(reason => console.warn(reason));
  }

  @Delete(':id')
  @UsePipes(new ParseIntPipe())
  @ApiResponse({
    status: 204, description: 'Record deleted'
  })
  delete(@Param() params) {
    return this.service.deleteInvoice(params.id).catch(reason => console.warn(reason));
  }

  @Post()
  @UsePipes(new ValidationPipe({}))
  @ApiResponse({
    status: 201, description: 'Record created', type: InvoiceDTO
  })
  @ApiResponse({
    status: 422, description: 'Unprocessable Entity'
  })
  create(@Body() invoice: CreateInvoiceDTO) {
    return this.service.createInvoice(invoice).catch(reason => console.warn(reason));
  }

  @Post('/multi')
  @UsePipes(new ValidationPipe({}))
  @ApiResponse({
    status: 201, description: 'Records created', type: [InvoiceDTO]
  })
  @ApiResponse({
    status: 422, description: 'Unprocessable Entity'
  })
  @ApiBody({type: [CreateInvoiceDTO]})
  createMulti(@Body() invoices: CreateInvoiceDTO[]) {
    return this.service.createInvoices(invoices);
  }
}
