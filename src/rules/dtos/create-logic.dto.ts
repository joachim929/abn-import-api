import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { LogicValue } from '../entities/logic-value.entity';
import { ConditionOperatorEnum } from '../interfaces/condition-operator.enum';
import { BaseValidateDTO } from '../../shared/dtos/base-validate.dto';
import { LogicValueDTO } from './logic-value.dto';
import { TransferKeyEnum } from '../interfaces/transfer-key.enum';

export class CreateLogicDTO extends BaseValidateDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsArray()
  @Type(() => LogicValue)
  values: LogicValueDTO[];

  @ApiProperty({enum: ConditionOperatorEnum, enumName: 'ConditionOperatorEnum'})
  @IsEnum(ConditionOperatorEnum)
  conditionOperator: ConditionOperatorEnum;

  @ApiProperty({enum: TransferKeyEnum, enumName: 'TransferKeyEnum'})
  @IsEnum(TransferKeyEnum)
  transferKey: TransferKeyEnum;

  constructor(logic: CreateLogicDTO, validate = false) {
    super();
    this.name = logic.name;
    this.values = logic.values;
    this.conditionOperator = logic.conditionOperator;
    this.transferKey = logic.transferKey;

    if (validate) {
      this.validate();
    }
  }
}
