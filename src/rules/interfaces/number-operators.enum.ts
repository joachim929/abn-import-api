import { ConditionOperatorEnum } from './condition-operator.enum';

export enum NumberOperatorsEnum {
  Equals = ConditionOperatorEnum.Equals,
  NotEqual = ConditionOperatorEnum.NotEqual,
  GreaterThan = ConditionOperatorEnum.GreaterThan,
  GreaterOrEqualThan = ConditionOperatorEnum.GreaterOrEqualThan,
  LessThan = ConditionOperatorEnum.LessThan,
  LessOrEqualThan = ConditionOperatorEnum.LessOrEqualThan
}
