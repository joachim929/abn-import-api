import { Injectable } from '@nestjs/common';
import { PreSaveDTO } from '../dtos/transfer-batch-import.dto';
import { ConditionOperatorEnum } from '../../rules/interfaces/condition-operator.enum';
import { Category } from '../../category/category.entity';
import { TransferCondition } from '../../rules/entities/transfer-condition.entity';
import { Logic } from '../../rules/entities/logic.entity';

interface TransferLogicInterface {
  Amount: number;
  Description: string;
  TransactionDate: Date;
  CurrencyCode: string;
  AccountNumber: number;
  StartBalance: number;
  EndBalance: number;
}

@Injectable()
export class AssignService {
  autoAssignTransfer(transfer: PreSaveDTO, rules: TransferCondition[]): Category | undefined {
    const formattedTransfer = {
      Amount: transfer.mutation.amount,
      Description: transfer.mutation.description,
      TransactionDate: transfer.transfer.transactionDate,
      CurrencyCode: transfer.transfer.currencyCode,
      AccountNumber: transfer.transfer.accountNumber,
      StartBalance: transfer.transfer.startBalance,
      EndBalance: transfer.transfer.endBalance
    };
    const categoryContenders = []
    for (const rule of rules) {
      if (rule.orLogic.length === 0 && rule.andLogic.length === 0) {
        break;
      }
      if (rule.autoAssign) {
        categoryContenders.push(this.checkAutoAssignParams(formattedTransfer, rule));
      }
      // todo: hintCase
    }
    let category;
    if (categoryContenders.length > 0 ) {
      const filteredCategories = categoryContenders.filter((category) => !!category);
      category = filteredCategories.length === 1 ? filteredCategories[0] : undefined;
    }
    return category;
  }

  private checkAutoAssignParams(transfer: TransferLogicInterface, rule: TransferCondition): Category {
    let andLogicCheck = false;
    let orLogicCheck = false;
    if (rule?.orLogic?.length > 0 && rule?.andLogic?.length > 0) {
      andLogicCheck = this.checkAndLogic(transfer, rule);
      orLogicCheck = this.checkOrLogic(transfer, rule);
      return andLogicCheck && orLogicCheck ? rule.category : null;
    } else if (rule?.orLogic?.length > 0) {
      orLogicCheck = this.checkOrLogic(transfer, rule);
      return orLogicCheck ? rule.category : null;
    } else if (rule?.andLogic?.length > 0) {
      andLogicCheck = this.checkAndLogic(transfer, rule);
      return andLogicCheck ? rule.category : null;
    }
    return null;
  }

  private checkAndLogic(transfer: TransferLogicInterface, rule: TransferCondition): boolean {
    let canAutoAssign = true;
    for (const logic of rule.andLogic) {
      if (!this.testLogic(transfer[logic.transferKey], logic)) {
        canAutoAssign = false;
        break;
      }
    }

    return canAutoAssign && rule.andLogic?.length > 0;
  }

  private checkOrLogic(transfer: TransferLogicInterface, rule: TransferCondition): boolean {
    let canAutoAssign = false;
    for (const logic of rule.orLogic) {
      if (this.testLogic(transfer[logic.transferKey], logic)) {
        canAutoAssign = true;
        break;
      }
    }

    return canAutoAssign;
  }

  private testLogic(testValue, logic: Logic): boolean {
    switch(logic.conditionOperator) {
      case ConditionOperatorEnum.Equals: {
        return this.testEquals(testValue, logic.value);
      }
      case ConditionOperatorEnum.NotEqual: {
        return this.testNotEqual(testValue, logic.value);
      }
      case ConditionOperatorEnum.GreaterThan: {
        return this.testGreaterThan(testValue, logic.value)
      }
      case ConditionOperatorEnum.GreaterOrEqualThan: {
        return this.testGreaterOrEqualThan(testValue, logic.value)
      }
      case ConditionOperatorEnum.LessThan: {
        return this.testLessThan(testValue, logic.value)
      }
      case ConditionOperatorEnum.LessOrEqualThan: {
        return this.testLessOrEqualThan(testValue, logic.value)
      }
      case ConditionOperatorEnum.Contains: {
        return this.testContains(testValue, logic.value)
      }
      case ConditionOperatorEnum.NotContain: {
        return this.testNotContain(testValue, logic.value);
      }
      case ConditionOperatorEnum.Like: {
        return this.testLike(testValue, logic.value);
      }
      case ConditionOperatorEnum.NotLike: {
        return this.testNotLike(testValue, logic.value);
      }
      default: {
        return false;
      }
    }
  }

  private testEquals(testValue, compareValue): boolean {
    return testValue === compareValue;
  }
  private testNotEqual(testValue, compareValue): boolean {
    return testValue !== compareValue;
  }
  private testGreaterThan(testValue, compareValue): boolean {
    return testValue > compareValue;
  }
  private testGreaterOrEqualThan(testValue, compareValue): boolean {
    return testValue >= compareValue;
  }
  private testLessThan(testValue, compareValue): boolean {
    return testValue < compareValue;
  }
  private testLessOrEqualThan(testValue, compareValue): boolean {
    return testValue <= compareValue;
  }
  private testContains(testValue, compareValue): boolean {
    return compareValue.indexOf(testValue) > -1;
  }
  private testNotContain(testValue, compareValue): boolean {
    return compareValue.indexOf(testValue) < 0;
  }
  private testLike(testValue, compareValue): boolean {
    return compareValue.includes(testValue);
  }
  private testNotLike(testValue, compareValue): boolean {
    return !compareValue.includes(testValue);
  }


}
