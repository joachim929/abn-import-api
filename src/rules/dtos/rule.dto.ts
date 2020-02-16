import { Rule } from '../rule.entity';
import { AmountDTO } from '../../amount/dtos/amount.dto';
import { DescriptionDTO } from '../../description/dtos/description.dto';

export class RuleDTO {
  id: number;
  name: string;
  categoryId: number;
  autoAssign: boolean;
  isActive: boolean;
  amount: AmountDTO[];
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
