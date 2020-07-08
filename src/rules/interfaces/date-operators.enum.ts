import { ConditionOperatorEnum } from './condition-operator.enum';

export enum DateOperatorsEnum {
  Equals = ConditionOperatorEnum.Equals,
  NotEqual = ConditionOperatorEnum.GreaterThan,
  GreaterThan = ConditionOperatorEnum.GreaterThan,
  GreaterOrEqualThan = ConditionOperatorEnum.GreaterOrEqualThan,
  LessThan = ConditionOperatorEnum.LessThan,
  LessOrEqualThan = ConditionOperatorEnum.LessOrEqualThan,
}
