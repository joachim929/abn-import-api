import { Amount } from '../../amount/amount.entity';
import { Rule } from '../rule.entity';

export class RuleDto {
  id: number;
  name: string;
  categoryId: number;
  autoAssign: boolean;
  isActive: boolean;
  amount: Amount[];

  constructor(rule: Rule, amountRules: Amount[]) {
    this.id = rule.id;
    this.name = rule.name;
    this.categoryId = rule.categoryId;
    this.autoAssign = rule.autoAssign;
    this.isActive = rule.isActive;
    this.amount = amountRules;
  }
}
