import { ConditionOperatorEnum } from './condition-operator.enum';

export type StringOperatorType =
  ConditionOperatorEnum.Equals |
  ConditionOperatorEnum.NotEqual |
  ConditionOperatorEnum.Contains |
  ConditionOperatorEnum.NotContain;

