import { Rule } from '../rule.entity';
import { AmountDTO } from '../../amount/dtos/amount.dto';
import { DescriptionDTO } from '../../description/dtos/description.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RuleDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  autoAssign: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  amount: AmountDTO[];

  @ApiProperty()
  description: DescriptionDTO[];

  constructor(rule: Rule, amountRules?: AmountDTO[], descriptionRules?: DescriptionDTO[]) {
    this.id = rule.id;
    this.name = rule.name;
    this.categoryId = rule.categoryId;
    this.autoAssign = rule.autoAssign;
    this.isActive = rule.isActive;
    this.amount = amountRules;
    this.description = descriptionRules;
  }
}
