import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseValidateDTO } from '../../shared/dtos/base-validate.dto';

export class LogicValueDTO extends BaseValidateDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  value: string;

  constructor(logicValue: LogicValueDTO, validate?: boolean) {
    super();
    this.id = logicValue.id;
    this.value = logicValue.value;

    if (validate) {
      this.validate();
    }
  }
}
