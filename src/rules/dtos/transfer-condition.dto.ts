import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { LogicDTO } from './logic.dto';
import { Type } from 'class-transformer';
import { TransferCondition } from '../entities/transfer-condition.entity';
import { CategoryDTO } from '../../category/dtos/category.dto';
import { BaseValidateDTO } from '../../shared/dtos/base-validate.dto';

export class TransferConditionDTO extends BaseValidateDTO {
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
    super();
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
}
