import { CreateTransferConditionDTO } from './create-transfer-condition.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
  validateSync,
} from 'class-validator';
import { LogicDTO } from './logic.dto';
import { Type } from 'class-transformer';
import { TransferCondition } from '../entities/transfer-condition.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CategoryDTO } from '../../category/dtos/category.dto';

export class TransferConditionDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @Length(36, 36)
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @Type(() => CategoryDTO)
  @IsOptional()
  category: CategoryDTO;

  @ApiProperty()
  @IsBoolean()
  autoAssign?: boolean = false;

  @ApiProperty({
    type: LogicDTO,
    isArray: true
  })
  @IsArray()
  @Type(() => LogicDTO)
  @ValidateIf(transferCondition => !transferCondition.andLogic)
  orLogic: LogicDTO[];

  @ApiProperty({
    type: LogicDTO,
    isArray: true
  })
  @IsArray()
  @Type(() => LogicDTO)
  @ValidateIf(transferCondition => !transferCondition.orLogic)
  andLogic: LogicDTO[];

  constructor(transferCondition: TransferConditionDTO | TransferCondition, validate = false) {
    this.id = transferCondition.id;
    this.name = transferCondition.name;
    this.description = transferCondition?.description;
    this.category = transferCondition?.category as CategoryDTO;
    this.autoAssign = transferCondition.autoAssign;
    this.orLogic = this.mapLogic(transferCondition.orLogic as LogicDTO[]);
    this.andLogic = this.mapLogic(transferCondition.andLogic as LogicDTO[]);
    if (validate) {
      this.validate();
    }
  }

  mapLogic(logic: LogicDTO[]) {
    return logic?.map((item) => new LogicDTO(item));
  }

  validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
  }
}
