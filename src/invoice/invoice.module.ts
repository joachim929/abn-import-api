import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { InvoiceRepositoryService } from './invoice-repository/invoice-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { PostInvoiceService } from './services/post-invoice/post-invoice.service';
import { SplitInvoiceService } from './services/split-invoice/split-invoice.service';
import { FilteredInvoiceService } from './services/filtered-invoice/filtered-invoice.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService,
    InvoiceRepositoryService,
    PostInvoiceService,
    SplitInvoiceService,
    FilteredInvoiceService],
})
export class InvoiceModule {
}
