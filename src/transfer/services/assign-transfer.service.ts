import { Injectable } from '@nestjs/common';
import { ConditionOperatorEnum } from '../../rules/interfaces/condition-operator.enum';
import { Category } from '../../category/category.entity';
import { TransferCondition } from '../../rules/entities/transfer-condition.entity';
import { Logic } from '../../rules/entities/logic.entity';
import { PreSaveDTO } from '../dtos/pre-save.dto';

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
export class AssignTransferService {
  autoAssignTransfer(transfer: PreSaveDTO, rules: TransferCondition[]): Category[] {
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
    }
    return categoryContenders.filter((category) => !!category);
  }

  checkAutoAssignParams(transfer: TransferLogicInterface, rule: TransferCondition): Category {
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
    let score = 0;
    for (const logic of rule.andLogic) {
      if (this.testLogic(transfer[logic.transferKey], logic)) {
        score += 2;
      } else {
        canAutoAssign = false;
      }
    }

    return canAutoAssign && rule.andLogic?.length > 0;
  }

  private checkOrLogic(transfer: TransferLogicInterface, rule: TransferCondition): boolean {
    let canAutoAssign = false;
    let score = 0;
    for (const logic of rule.orLogic) {
      if (this.testLogic(transfer[logic.transferKey], logic)) {
        canAutoAssign = true;
        score++;
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

  testEquals(testValue, compareValue): boolean {
    if (testValue instanceof Date && compareValue instanceof Date) {
      return testValue.toString() === compareValue.toString();
    } else if (typeof testValue === 'number' ) {
      return testValue === Number(compareValue);
    } else {
      return testValue === compareValue;
    }
  }
  testNotEqual(testValue, compareValue): boolean {
    if (testValue instanceof Date && compareValue instanceof Date) {
      return testValue.toString() !== compareValue.toString();
    } else {
      return testValue !== compareValue;
    }
  }
  testGreaterThan(testValue, compareValue): boolean {
    return testValue > compareValue;
  }
  testGreaterOrEqualThan(testValue, compareValue): boolean {
    return testValue >= compareValue;
  }
  testLessThan(testValue, compareValue): boolean {
    return testValue < compareValue;
  }
  testLessOrEqualThan(testValue, compareValue): boolean {
    return testValue <= compareValue;
  }
  testContains(testValue, compareValue): boolean {
    return testValue.indexOf(compareValue) > -1;
  }
  testNotContain(testValue, compareValue): boolean {
    return testValue.indexOf(compareValue) < 0;
  }

  /**
   * todo: Need to figure how like is going to work as now it works like contains
   *  ideas: have the compare string require min length of ~4 and then check for indexOf substrings of said compare value
   *  Alternatively, just leave it out as its more "complex" that the layman might not understand
   * https://www.sqlservertutorial.net/sql-server-basics/sql-server-like/
   */
  testLike(testValue, compareValue): boolean {
    return testValue.includes(compareValue);
  }
  testNotLike(testValue, compareValue): boolean {
    return !testValue.includes(compareValue);
  }


}
