import { ConditionOperatorEnum } from './condition-operator.enum';

export type StringOperatorType =
  ConditionOperatorEnum.equals |
  ConditionOperatorEnum.contains |
  ConditionOperatorEnum.like |
  ConditionOperatorEnum.not
