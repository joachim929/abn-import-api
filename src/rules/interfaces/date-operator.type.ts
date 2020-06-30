import { ConditionOperatorEnum } from './condition-operator.enum';

export type DateOperatorType =
  ConditionOperatorEnum.Equals |
  ConditionOperatorEnum.NotEqual |
  ConditionOperatorEnum.GreaterThan |
  ConditionOperatorEnum.GreaterOrEqualThan |
  ConditionOperatorEnum.LessThan |
  ConditionOperatorEnum.LessOrEqualThan;


export enum DateOperators {
  Equals = ConditionOperatorEnum.Equals,
  NotEqual = ConditionOperatorEnum.GreaterThan,
  GreaterThan = ConditionOperatorEnum.GreaterThan,
  GreaterOrEqualThan = ConditionOperatorEnum.GreaterOrEqualThan,
  LessThan = ConditionOperatorEnum.LessThan,
  LessOrEqualThan = ConditionOperatorEnum.LessOrEqualThan,
}
