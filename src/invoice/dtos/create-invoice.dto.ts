import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInvoiceDTO {
  @Transform(accountNumber => Number(accountNumber))
  readonly accountNumber: number;

  @IsString()
  readonly mutationCode: string;

  @Transform(transactionDate => new Date().setUTCFullYear(
    transactionDate.slice(0, 4),
    transactionDate.slice(4, 6),
    transactionDate.slice(6, 8)
  ))
  readonly transactionDate?: Date;

  @Transform(valueDate => new Date().setUTCFullYear(
    valueDate.slice(0, 4),
    valueDate.slice(4, 6),
    valueDate.slice(6, 8)
  ))
  readonly valueDate?: Date;

  @Transform(startBalance => Number(startBalance))
  readonly startBalance: number;

  @Transform(endBalance => Number(endBalance))
  readonly endBalance: number;

  @Transform(amount => Number(amount))
  readonly amount: number;

  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly comment?: string;

  @IsOptional()
  @Transform(categoryId => Number(categoryId))
  readonly categoryId?: number;

  @Transform(userId => Number(userId))
  readonly userId: number;
}
