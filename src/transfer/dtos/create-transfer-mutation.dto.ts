import { IsBoolean, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from '../../category/category.entity';
import { Transfer } from '../entities/transfer.entity';
import { TransferMutation } from '../entities/transfer-mutation.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TransferMutationDTO } from './transfer-batch-import.dto';

export class CreateTransferMutationDTO {
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
  @Type(() => Category)
  category: Category;
  transfer: Transfer;
  parent: TransferMutation;
  children: TransferMutation[];

  constructor(transferMutation: TransferMutationDTO, parent: TransferMutation) {
    this.description = transferMutation.description;
    this.comment = transferMutation.comment || null;
    this.amount = transferMutation.amount;
    this.active = true;
    this.category = parent?.category || null;
    this.transfer = parent.transfer;
    this.parent = parent;
    this.children = [];
    this.validate();
  }

  validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
  }
}
