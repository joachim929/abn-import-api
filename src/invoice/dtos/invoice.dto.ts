import { Invoice } from '../invoice.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InvoiceDTO {

  @ApiProperty()
  accountNumber: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  categoryId?: number;

  @ApiPropertyOptional()
  description: string;

  @ApiProperty()
  endBalance: number;

  @ApiProperty()
  id: number;

  @ApiProperty()
  mutationCode: string;

  @ApiPropertyOptional()
  originalId: number;

  @ApiProperty()
  startBalance: number;

  @ApiProperty()
  transactionDate: Date;

  @ApiProperty()
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
