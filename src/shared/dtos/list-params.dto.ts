import { IsOptional, IsString } from 'class-validator';

export class ListParams {
  @IsOptional()
  @IsString()
  orderBy?: string;
}
