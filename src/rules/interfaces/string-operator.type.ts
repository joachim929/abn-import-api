import { ConditionOperatorEnum } from './condition-operator.enum';

export type StringOperatorType =
  ConditionOperatorEnum.Equals |
  ConditionOperatorEnum.Contains |
  ConditionOperatorEnum.Like |
  ConditionOperatorEnum.Not
