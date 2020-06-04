import { TransferCondition } from '../entities/transfer-condition.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LogicValue } from '../entities/logic-value.entity';
import { ConditionOperatorType } from '../interfaces/condition-operator.type';
import { ConditionOperatorEnum } from '../interfaces/condition-operator.enum';
import { Logic } from '../entities/logic.entity';

export class LogicDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Type(() => TransferCondition)
  @ValidateIf(logic => !logic.orCondition)
  @IsNotEmptyObject()
  andCondition?: TransferCondition;

  @ApiProperty()
  @Type(() => TransferCondition)
  @ValidateIf(logic => !logic.andCondition)
  @IsNotEmptyObject()
  orCondition?: TransferCondition;

  @ApiProperty()
  @IsArray()
  @Type(() => LogicValue)
  values: LogicValue[];

  @ApiProperty()
  @IsEnum(ConditionOperatorEnum)
  conditionOperator: ConditionOperatorType;

  constructor(logic: Logic | LogicDTO) {
    this.id = logic.id;
    this.name = logic.name;
    this.andCondition = logic?.andCondition;
    this.orCondition = logic?.orCondition;
    this.values = logic.values;
  }
}
