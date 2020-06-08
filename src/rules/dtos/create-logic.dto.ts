import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ConditionOperatorEnum } from '../interfaces/condition-operator.enum';
import { BaseValidateDTO } from '../../shared/dtos/base-validate.dto';
import { TransferKeyEnum } from '../interfaces/transfer-key.enum';
import { LogicTypeEnum } from '../interfaces/logic-type.enum';

export class CreateLogicDTO extends BaseValidateDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

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

  // todo: see if you can get strong typing on this
  andCondition: any = null;
  orCondition: any = null;

  constructor(logic: CreateLogicDTO, validate = false) {
    super();
    this.name = logic.name;
    this.value = logic.value;
    this.conditionOperator = logic.conditionOperator;
    this.transferKey = logic.transferKey;
    this.andCondition = logic.andCondition;
    this.orCondition = logic.orCondition;
    this.type = logic.type;

    if (validate) {
      this.validate();
    }
  }
}
