import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { LogicValue } from '../entities/logic-value.entity';
import { ConditionOperatorEnum } from '../interfaces/condition-operator.enum';
import { ConditionOperatorType } from '../interfaces/condition-operator.type';
import { BaseValidateDTO } from '../../shared/dtos/base-validate.dto';
import { LogicValueDTO } from './logic-value.dto';

export class CreateLogicDTO extends BaseValidateDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsArray()
  @Type(() => LogicValue)
  values: LogicValueDTO[];

  @ApiProperty()
  @IsEnum(ConditionOperatorEnum)
  conditionOperator: ConditionOperatorType;

  constructor(logic: CreateLogicDTO, validate = false) {
    super();
    this.name = logic.name;
    this.values = logic.values;
    this.conditionOperator = logic.conditionOperator;

    if (validate) {
      this.validate();
    }
  }
}
