import { InvoiceDTO } from './invoice.dto';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum OrderEnum {
  'ASC',
  'DESC'
}

export type OrderType = OrderEnum.ASC | OrderEnum.DESC;

export class InvoiceFilteredDTO {

  @Transform(startDate => new Date(startDate))
  startDate?: Date;

  @Transform(endDate => new Date(endDate))
  endDate?: Date;

  @Transform(limit => Number(limit))
  limit?: number;

  @Transform(skip => Number(skip))
  skip?: number;

  @Transform(maxAmount => Number(maxAmount))
  maxAmount?: number;

  @Transform(minAmount => Number(minAmount))
  minAmount?: number;

  @IsOptional()
  records?: InvoiceDTO[];

  @IsString()
  order?: OrderType;
}
