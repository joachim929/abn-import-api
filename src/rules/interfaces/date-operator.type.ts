import { ConditionOperatorEnum } from './condition-operator.enum';

export type DateOperatorType =
  ConditionOperatorEnum.Equals |
  ConditionOperatorEnum.GreaterThan |
  ConditionOperatorEnum.GreaterOrEqualThan |
  ConditionOperatorEnum.LessThan |
  ConditionOperatorEnum.LessOrEqualThan |
  ConditionOperatorEnum.Not


export enum DateOperators {
  Equals = ConditionOperatorEnum.Equals,
  GreaterThan = ConditionOperatorEnum.GreaterThan,
  GreaterOrEqualThan = ConditionOperatorEnum.GreaterOrEqualThan,
  LessThan = ConditionOperatorEnum.LessThan,
  LessOrEqualThan = ConditionOperatorEnum.LessOrEqualThan,
  Not = ConditionOperatorEnum.Not
}
