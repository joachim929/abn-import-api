import { Invoice } from '../invoice.entity';

export class InvoiceDTO {
  accountNumber: number;
  amount: number;
  categoryId?: number;
  description: string;
  endBalance: number;
  id: number;
  mutationCode: string;
  originalId: number;
  startBalance: number;
  transactionDate: Date;
  userId: number;

  constructor(invoice: Invoice) {
    this.accountNumber = invoice.accountNumber;
    this.amount = invoice.amount;
    if (invoice.categoryId) {
      this.categoryId = invoice.categoryId;
    }
    this.description = invoice.description;
    this.endBalance = invoice.endBalance;
    this.id = invoice.id;
    this.mutationCode = invoice.mutationCode;
    if (invoice.originalId) {
      this.originalId = invoice.originalId;
    }
    this.startBalance = invoice.startBalance;
    this.transactionDate = invoice.transactionDate;
    this.userId = invoice.userId;
  }

}
