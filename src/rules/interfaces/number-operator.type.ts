import { ConditionOperatorEnum } from './condition-operator.enum';

export type NumberOperatorType =
  ConditionOperatorEnum.equals |
  ConditionOperatorEnum.greaterThan |
  ConditionOperatorEnum.greaterOrEqualThan |
  ConditionOperatorEnum.lessThan |
  ConditionOperatorEnum.lessOrEqualThan |
  ConditionOperatorEnum.not
