import { ConditionOperatorEnum } from './condition-operator.enum';

export type ConditionOperatorType =
  ConditionOperatorEnum.Equals |
  ConditionOperatorEnum.GreaterOrEqualThan |
  ConditionOperatorEnum.GreaterThan |
  ConditionOperatorEnum.LessOrEqualThan |
  ConditionOperatorEnum.LessThan |
  ConditionOperatorEnum.Contains |
  ConditionOperatorEnum.Not |
  ConditionOperatorEnum.Like
