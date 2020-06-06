import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ConditionOperatorType } from '../interfaces/condition-operator.type';
import { ConditionOperatorEnum } from '../interfaces/condition-operator.enum';
import { Logic } from '../entities/logic.entity';
import { LogicValueDTO } from './logic-value.dto';
import { CreateLogicDTO } from './create-logic.dto';

export class LogicDTO extends CreateLogicDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    type: LogicValueDTO,
    isArray: true
  })
  @IsArray()
  @Type(() => LogicValueDTO)
  values: LogicValueDTO[];

  @ApiProperty()
  @IsEnum(ConditionOperatorEnum)
  conditionOperator: ConditionOperatorType;

  constructor(logic: Logic | LogicDTO, validate = false) {
    super(logic as LogicDTO);
    this.id = logic.id;
    if (validate) {
      this.validate();
    }
  }
}
