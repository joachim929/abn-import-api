import { ListParams } from '../../shared/dtos/list-params.dto';
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional } from 'class-validator';
import { TransferMutationDTO } from './transfer-batch-import.dto';

export class TransferListParams extends ListParams {
  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsArray()
  transferMutations?: TransferMutationDTO[];

  @IsOptional()
  @IsBoolean()
  active?: boolean
}