import { Amount } from '../../amount/amount.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AndOr } from '../../description/dtos/description.dto';

export type AmountLogic = 'lessThan' | 'greaterThan' | 'equalTo';

export class AmountDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ruleId: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  logic: AmountLogic;

  @ApiPropertyOptional()
  andOr?: AndOr;

  constructor(amount: Amount) {
    this.id = amount.id;
    this.ruleId = amount.ruleId;
    this.amount = amount.amount;
    this.logic = amount.logic;
    if (amount.andOr) {
      this.andOr = amount.andOr;
    }
  }
}
