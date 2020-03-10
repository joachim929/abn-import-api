import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { RawTransferSerializerDTO } from '../../invoice/dtos/raw-invoice-json.dto';
import { Transfer } from '../entities/transfer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

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
