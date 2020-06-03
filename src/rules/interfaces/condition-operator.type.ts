import { ConditionOperatorEnum } from './condition-operator.enum';

export type ConditionOperatorType =
  ConditionOperatorEnum.equals |
  ConditionOperatorEnum.greaterOrEqualThan |
  ConditionOperatorEnum.greaterThan |
  ConditionOperatorEnum.lessOrEqualThan |
  ConditionOperatorEnum.lessThan |
  ConditionOperatorEnum.contains |
  ConditionOperatorEnum.not |
  ConditionOperatorEnum.like
