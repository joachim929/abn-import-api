import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum, IsNotEmpty,
  IsString, validateSync,
} from 'class-validator';
import { ConditionOperatorEnum } from '../interfaces/condition-operator.enum';
import { Logic } from '../entities/logic.entity';7
import { HttpException, HttpStatus } from '@nestjs/common';
import { LogicTypeEnum } from '../interfaces/logic-type.enum';
import { TransferKeyEnum } from '../interfaces/transfer-key.enum';

export class LogicDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty({enum: ConditionOperatorEnum, enumName: 'ConditionOperatorEnum'})
  @IsEnum(ConditionOperatorEnum)
  conditionOperator: ConditionOperatorEnum;

  @ApiProperty({enum: TransferKeyEnum, enumName: 'TransferKeyEnum'})
  @IsEnum(TransferKeyEnum)
  transferKey: TransferKeyEnum;

  @ApiProperty()
  @IsNotEmpty()
  type: LogicTypeEnum;

  constructor(logic: Logic | LogicDTO, validate = false) {
    this.id = logic.id;
    this.value = logic.value;
    this.conditionOperator = logic.conditionOperator;
    this.transferKey = logic.transferKey;
    this.type = logic.type;
    if (validate) {
      this.validate();
    }
  }

  validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
  }
}
