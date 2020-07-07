import { ListParams } from '../../shared/dtos/list-params.dto';
import { IsArray, IsBoolean, IsDate, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { TransferMutationDTO } from './transfer-mutation.dto';

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
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsArray()
  transferMutations?: TransferMutationDTO[];

  @IsOptional()
  @IsBoolean()
  active?: boolean
}
