import { InvoiceDTO } from './invoice.dto';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class InvoiceFilteredDTO {
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @IsOptional()
  records?: InvoiceDTO[];
}
