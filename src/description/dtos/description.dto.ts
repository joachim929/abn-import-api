import { Description } from '../description.entity';

export type DescriptionLogic = 'contains' | 'notContains';
export type AndOr = 'and' | 'or';

export class DescriptionDTO {
  id: number;
  ruleId: number;
  descriptionSubString: string;
  logic: DescriptionLogic;
  andOr: AndOr;

  constructor(description: Description) {
    this.id = description.id;
    this.ruleId = description.ruleId;
    this.descriptionSubString = description.descriptionSubString;
    this.logic = description.logic;
    if (description.andOr) {
      this.andOr = description.andOr;
    }
  }
}
