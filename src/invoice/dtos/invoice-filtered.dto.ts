import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum OrderEnum {
  'ASC',
  'DESC'
}

export type OrderType = OrderEnum.ASC | OrderEnum.DESC;

export class InvoiceFilteredDTO {

  @Transform(startDate => Number(startDate))
  startDate?: Date;

  @Transform(endDate => Number(endDate))
  endDate?: Date;

  @Transform(limit => Number(limit))
  limit?: number;

  @Transform(skip => Number(skip))
  skip?: number;

  @Transform(maxAmount => Number(maxAmount.toFixed(2)))
  maxAmount?: number;

  @Transform(minAmount => Number(minAmount.toFixed(2)))
  minAmount?: number;

  @IsOptional()
  records?: any[];

  @IsString()
  order?: OrderType;

  @Transform( count => Number(count))
  count?: number;

  @Transform(categoryId => Number(categoryId))
  categoryId?: number;
}
