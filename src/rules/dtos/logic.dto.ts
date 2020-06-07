import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
} from 'class-validator';
import { ConditionOperatorEnum } from '../interfaces/condition-operator.enum';
import { Logic } from '../entities/logic.entity';
import { CreateLogicDTO } from './create-logic.dto';

export class LogicDTO extends CreateLogicDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty()
  @IsEnum(ConditionOperatorEnum)
  conditionOperator: ConditionOperatorEnum;

  constructor(logic: Logic | LogicDTO, validate = false) {
    super(logic as LogicDTO);
    this.id = logic.id;
    if (validate) {
      this.validate();
    }
  }
}
