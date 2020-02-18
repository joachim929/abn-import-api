import { IsString } from 'class-validator';

export class CreateInvoiceDTO {
  @IsString() // todo check if this should be a number or not
  readonly accountNumber: string;

  @IsString()
  readonly mutationcode: string;

  @IsString()
  readonly transactiondate: string;

  @IsString()
  readonly valuedate: string;

  @IsString() // todo check if this should be a number or not
  readonly startsaldo: string;

  @IsString() // todo check if this should be a number or not
  readonly endsaldo: string;

  @IsString() // todo check if this should be a number or not
  readonly amount: string;

  @IsString()
  readonly description: string;
}
