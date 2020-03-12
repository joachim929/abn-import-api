import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { RawTransferSerializerDTO } from '../../invoice/dtos/raw-invoice-json.dto';
import { Transfer } from '../entities/transfer.entity';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { TransferMutation } from '../entities/transfer-mutation.entity';

export class TransferMutationDTO {
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
  @IsOptional()
  @IsNumber()
  mutationId?: number;
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  comment?: string;
  @IsNumber()
  amount: number;
  @IsOptional()
  @IsNumber()
  categoryId?: number;
  @IsNumber()
  startBalance: number;
  @IsNumber()
  endBalance: number;

  constructor(transfer: Transfer, mutation: TransferMutation) {
    this.id = transfer.id;
    this.accountNumber = transfer.accountNumber;
    this.currencyCode = transfer.currencyCode;
    this.valueDate = transfer.valueDate;
    this.transactionDate = transfer.transactionDate;
    this.mutationId = mutation.id;
    this.description = mutation.description;
    this.comment = mutation.comment || null;
    this.amount = mutation.amount;
    this.categoryId = mutation.categoryId || null;
    this.startBalance = transfer.startBalance;
    this.endBalance = transfer.endBalance;
  }
}

export class NewTransferMutationChild {
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  comment: string;
  @IsBoolean()
  active: boolean;
  @IsNumber()
  amount: number;
  @IsOptional()
  @IsNumber()
  categoryId: number;
  transfer: Transfer;
  parent: TransferMutation;
  children: TransferMutation[];

  constructor(transferMutation: TransferMutationDTO, parent: TransferMutation) {
    this.description = transferMutation.description;
    this.comment = transferMutation.comment || null;
    this.amount = transferMutation.amount;
    this.active = true;
    this.categoryId = transferMutation.categoryId || null;
    this.transfer = parent.transfer;
    this.parent = parent;
    this.children = [];
  }
}

export class IncomingTransferMutation {
  @IsString()
  id: string;
  @IsNumber()
  accountNumber: number;
  @IsString()
  currencyCode: string;
  @IsDate()
  valueDate: Date;
  @IsDate()
  transactionDate: Date;
  @IsOptional()
  @IsNumber()
  mutationId?: number;
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  comment?: string;
  @IsNumber()
  amount: number;
  @IsOptional()
  @IsNumber()
  categoryId?: number;
  @IsNumber()
  startBalance: number;
  @IsNumber()
  endBalance: number;

  constructor(transferMutation: TransferMutationDTO) {
    this.id = transferMutation.id;
    this.accountNumber = transferMutation.accountNumber;
    this.currencyCode = transferMutation.currencyCode;
    this.valueDate = new Date(transferMutation.valueDate);
    this.transactionDate = new Date(transferMutation.transactionDate);
    this.mutationId = transferMutation.mutationId || null;
    this.description = transferMutation.description;
    this.comment = transferMutation.comment || null;
    this.amount = transferMutation.amount;
    this.categoryId = transferMutation.categoryId || null;
    this.startBalance = transferMutation.startBalance;
    this.endBalance = transferMutation.endBalance;
  }
}

export class TransferBatchImportDto {
  @ApiModelProperty({ type: [RawTransferSerializerDTO] })
  existingTransfers?: RawTransferSerializerDTO[];
  @ApiModelProperty({ type: [Transfer] })
  savedTransfers?: Transfer[];
}

export class ValidatedRawTransfersDTO {
  validTransfers?: RawTransferSerializerDTO[];
  invalidTransfers?: RawTransferSerializerDTO[];
}

export class PreSaveTransferDTO {
  hash: string;
  accountNumber: number;
  currencyCode: string;
  valueDate: Date;
  transactionDate: Date;
  startBalance: number;
  endBalance: number;
}

export class PreSaveTransferMutationDTO {
  amount: number;
  description: string;
  transfer?: PreSaveTransferDTO;
}

export class PreSaveDTO {
  transfer: PreSaveTransferDTO;
  mutation: PreSaveTransferMutationDTO;
}
