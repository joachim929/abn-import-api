import { ConditionOperatorEnum } from './condition-operator.enum';

export type DateOperatorType =
  ConditionOperatorEnum.Equals |
  ConditionOperatorEnum.NotEqual |
  ConditionOperatorEnum.GreaterThan |
  ConditionOperatorEnum.GreaterOrEqualThan |
  ConditionOperatorEnum.LessThan |
  ConditionOperatorEnum.LessOrEqualThan;
