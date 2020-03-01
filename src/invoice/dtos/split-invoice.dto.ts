import { InvoiceDTO } from './invoice.dto';

export class SplitInvoiceDTO {
  patch: InvoiceDTO;
  split: InvoiceDTO;
}
