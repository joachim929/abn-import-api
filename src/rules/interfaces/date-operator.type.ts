import { ConditionOperatorEnum } from './condition-operator.enum';

export type DateOperatorType =
  ConditionOperatorEnum.equals |
  ConditionOperatorEnum.greaterThan |
  ConditionOperatorEnum.greaterOrEqualThan |
  ConditionOperatorEnum.lessThan |
  ConditionOperatorEnum.lessOrEqualThan |
  ConditionOperatorEnum.not
