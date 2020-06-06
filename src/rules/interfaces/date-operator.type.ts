import { ConditionOperatorEnum } from './condition-operator.enum';

export type DateOperatorType =
  ConditionOperatorEnum.Equals |
  ConditionOperatorEnum.GreaterThan |
  ConditionOperatorEnum.GreaterOrEqualThan |
  ConditionOperatorEnum.LessThan |
  ConditionOperatorEnum.LessOrEqualThan |
  ConditionOperatorEnum.Not
