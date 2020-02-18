import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInvoiceDTO {
  @Transform(accountnumber => Number(accountnumber))
  readonly accountnumber: number;

  @IsString()
  readonly mutationcode: string;

  @Transform(transactiondate => new Date().setUTCFullYear(
    transactiondate.slice(0, 4),
    transactiondate.slice(4, 6),
    transactiondate.slice(6, 8)
  ))
  readonly transactiondate: Date;

  @Transform(valuedate => new Date().setUTCFullYear(
    valuedate.slice(0, 4),
    valuedate.slice(4, 6),
    valuedate.slice(6, 8)
  ))
  readonly valuedate: Date;

  @Transform(startsaldo => Number(startsaldo))
  readonly startsaldo: number;

  @Transform(endsaldo => Number(endsaldo))
  readonly endsaldo: number;

  @Transform(amount => Number(amount))
  readonly amount: string;

  @IsString()
  readonly description: string;
}
