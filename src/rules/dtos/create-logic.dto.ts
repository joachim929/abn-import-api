import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ConditionOperatorEnum } from '../interfaces/condition-operator.enum';
import { BaseValidateDTO } from '../../shared/dtos/base-validate.dto';
import { TransferKeyEnum } from '../interfaces/transfer-key.enum';
import { LogicTypeEnum } from '../interfaces/logic-type.enum';
import { TransferCondition } from '../entities/transfer-condition.entity';
import { CreateTransferConditionDTO } from './create-transfer-condition.dto';
import { TransferConditionDTO } from './transfer-condition.dto';

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

  @ApiProperty()
  @IsOptional()
  andCondition?: CreateTransferConditionDTO | TransferConditionDTO;

  @ApiProperty()
  @IsOptional()
  orCondition?: CreateTransferConditionDTO | TransferConditionDTO;

  constructor(logic: CreateLogicDTO, validate = false) {
    super();
    this.name = logic.name;
    this.value = logic.value;
    this.conditionOperator = logic.conditionOperator;
    this.transferKey = logic.transferKey;
    if ((logic.andCondition as TransferConditionDTO)?.id) {
      this.andCondition = new TransferConditionDTO(logic.andCondition as TransferConditionDTO);
    } else {
      this.andCondition = new CreateTransferConditionDTO(logic.andCondition as CreateTransferConditionDTO);
    }
    if ((logic.orCondition as TransferConditionDTO)?.id) {
      this.orCondition = new TransferConditionDTO(logic.orCondition as TransferConditionDTO);
    } else {
      this.orCondition = new CreateTransferConditionDTO(logic.orCondition as CreateTransferConditionDTO);
    }
    this.type = logic.type;

    if (validate) {
      this.validate();
    }
  }
}
