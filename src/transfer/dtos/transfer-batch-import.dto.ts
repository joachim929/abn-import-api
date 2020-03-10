import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class TransferDTO {
  @Transform(id => Number(id))
  id: string;
  @Transform(accountNumber => Number(accountNumber))
  accountNumber: number;
  @IsString()
  currencyCode: string;
  @IsDate()
  valueDate: Date;
  @IsDate()
  transactionDate: Date;

  mutations: TransferMutationDTO[];
}

export class TransferMutationDTO {
  @Transform(balance => Number(balance))
  startBalance: number;
  @Transform(balance => Number(balance))
  endBalance: number;
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  comment?: string;
  @Transform(id => Number(id))
  id: number;
}
