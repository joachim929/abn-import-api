import { CreateTransferConditionDto } from './create-transfer-condition.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, Length, ValidateIf } from 'class-validator';
import { LogicDTO } from './logic.dto';
import { Type } from 'class-transformer';
import { TransferCondition } from '../entities/transfer-condition.entity';

export class TransferConditionDTO extends CreateTransferConditionDto {
  @ApiProperty()
  @IsString()
  @Length(36, 36)
  @IsNotEmpty()
  id: string;

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
    super(transferCondition);
    this.id = transferCondition.id;
    if (validate) {
      this.validate();
    }
  }

  mapLogic(logic: LogicDTO[]) {
    return logic?.map((item) => new LogicDTO(item));
  }
}
