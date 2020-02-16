import { Amount } from '../../amount/amount.entity';

export class AmountDTO {
  id: number;
  ruleId: number;
  amount: number;
  logic: 'lessThan' | 'greaterThan' | 'equalTo';
  andOr?: 'and' | 'or';

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
