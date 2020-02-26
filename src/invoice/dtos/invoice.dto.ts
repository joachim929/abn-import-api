import { Invoice } from '../invoice.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class InvoiceDTO {

  @ApiProperty()
  accountNumber: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  categoryId?: number;

  @ApiProperty()
  comment?: string;

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
    Object.keys(invoice).map(key => {
      this[key] = invoice[key];
    });
  }

}

export class UserIdDTO {
  @IsNumberString()
  id: number;
}
