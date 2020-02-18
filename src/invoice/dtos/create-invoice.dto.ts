import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInvoiceDTO {
  @Transform(accountnumber => Number(accountnumber))
  readonly accountNumber: number;

  @IsString()
  readonly mutationCode: string;

  @Transform(transactiondate => new Date().setUTCFullYear(
    transactiondate.slice(0, 4),
    transactiondate.slice(4, 6),
    transactiondate.slice(6, 8)
  ))
  readonly transactionDate?: Date;

  @Transform(valuedate => new Date().setUTCFullYear(
    valuedate.slice(0, 4),
    valuedate.slice(4, 6),
    valuedate.slice(6, 8)
  ))
  readonly valueDate?: Date;

  @Transform(startsaldo => Number(startsaldo))
  readonly startBalance: number;

  @Transform(endsaldo => Number(endsaldo))
  readonly endBalance: number;

  @Transform(amount => Number(amount))
  readonly amount: number;

  @IsString()
  readonly description: string;

  @IsString()
  readonly comment?: string;

  @Transform(categoryId => Number(categoryId))
  readonly categoryId?: number;

  @Transform(userId => Number(userId))
  readonly userId: number;
}
