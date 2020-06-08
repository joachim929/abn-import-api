import { BaseValidateDTO } from '../../shared/dtos/base-validate.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { CategoryDTO } from '../../category/dtos/category.dto';
import { Type } from 'class-transformer';
import { LogicDTO } from './logic.dto';
import { CreateLogicDTO } from './create-logic.dto';
import { TransferCondition } from '../entities/transfer-condition.entity';

export class CreateTransferConditionDTO extends BaseValidateDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Type(() => CategoryDTO)
  @IsOptional()
  category: CategoryDTO;

  @ApiProperty()
  @IsBoolean()
  autoAssign?: boolean = false;

  @ApiProperty({
    type: LogicDTO,
    isArray: true,
  })
  @IsArray()
  @Type(() => LogicDTO)
  @ValidateIf(transferCondition => !transferCondition.andLogic)
  @IsNotEmpty()
  orLogic: CreateLogicDTO[];

  @ApiProperty({
    type: LogicDTO,
    isArray: true,
  })
  @IsArray()
  @Type(() => LogicDTO)
  @ValidateIf(transferCondition => !transferCondition.orLogic)
  @IsNotEmpty()
  andLogic: CreateLogicDTO[];

  constructor(transferCondition: CreateTransferConditionDTO | TransferCondition, validate = false) {
    super();
    this.name = transferCondition.name;
    this.description = transferCondition?.description;
    this.category = transferCondition?.category as CategoryDTO;
    this.autoAssign = transferCondition.autoAssign;
    this.orLogic = this.mapLogic(transferCondition?.orLogic as CreateLogicDTO[]);
    this.andLogic = this.mapLogic(transferCondition?.andLogic as CreateLogicDTO[]);

    if (validate) {
      this.validate();
    }
  }

  mapLogic(logic: CreateLogicDTO[]) {
    return logic?.map((item) => new CreateLogicDTO(item));
  }
}
