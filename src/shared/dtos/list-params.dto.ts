import { IsNumber, IsOptional, IsString } from 'class-validator';

export type OrderDirection = 'ASC' | 'DESC'

export class ListParams {
  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsString()
  orderDirection?: OrderDirection;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  count?: number;
}
