export type Ordering = 'Asc' | 'Desc';

export class FilteredInvoiceDTO {
  date: {
    from: Date,
    to: Date
  };
  limit: number;
  start: number;
  order: Ordering
}
