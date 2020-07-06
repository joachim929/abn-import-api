import { Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';
import { RawTransferSerializerDTO } from '../../shared/dtos/raw-invoice-json.dto';
import { Transfer } from '../entities/transfer.entity';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { TransferMutation } from '../entities/transfer-mutation.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CategoryDTO } from '../../category/dtos/category.dto';
import { Category } from '../../category/category.entity';

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
  @IsNumber()
  startBalance: number;
  @IsNumber()
  endBalance: number;
  @IsOptional()
  @Type(() => CategoryDTO)
  category: CategoryDTO;

  constructor(transfer: Transfer, mutation: TransferMutation, validate = false) {
    this.id = transfer.id;
    this.accountNumber = transfer.accountNumber;
    this.currencyCode = transfer.currencyCode;
    this.valueDate = transfer.valueDate;
    this.transactionDate = transfer.transactionDate;
    this.mutationId = mutation.id;
    this.description = mutation.description;
    this.comment = mutation.comment || null;
    this.amount = mutation.amount;
    this.category = mutation.category ? new CategoryDTO(mutation.category) : null;
    this.startBalance = transfer.startBalance;
    this.endBalance = transfer.endBalance;
    if (validate) {
      this.validate();
    }
  }

  validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
  }
}

export class TransferBatchImportDto {
  @ApiModelProperty({ type: [RawTransferSerializerDTO] })
  existingTransfers?: RawTransferSerializerDTO[];
  @ApiModelProperty({ type: [TransferMutationDTO] })
  savedTransfers?: TransferMutationDTO[];
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
  forced?: boolean = false;
}

export class PreSaveTransferMutationDTO {
  amount: number;
  description: string;
  transfer?: PreSaveTransferDTO;
  category?: Category;
}

export class PreSaveDTO {
  transfer: PreSaveTransferDTO;
  mutation: PreSaveTransferMutationDTO;
  categoryHints?: CategoryDTO[];
}
