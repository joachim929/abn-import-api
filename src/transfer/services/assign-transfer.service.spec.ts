import { Test, TestingModule } from '@nestjs/testing';
import { AssignTransferService } from './assign-transfer.service';
import { PreSaveDTO } from '../dtos/pre-save.dto';
import { PreSaveTransferDTO } from '../dtos/pre-save-transfer.dto';
import { PreSaveTransferMutationDTO } from '../dtos/pre-save-transfer-mutation.dto';
import { TransferCondition } from '../../rules/entities/transfer-condition.entity';
import { Logic } from '../../rules/entities/logic.entity';
import { TransferKeyEnum } from '../../rules/interfaces/transfer-key.enum';
import { ConditionOperatorEnum } from '../../rules/interfaces/condition-operator.enum';
import { LogicTypeEnum } from '../../rules/interfaces/logic-type.enum';
import { Category } from '../../category/category.entity';

fdescribe('AssignService', () => {
  let now;
  let dateOne: Date;
  let dateTwo: Date;
  let service: AssignTransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignTransferService],
    }).compile();

    service = module.get<AssignTransferService>(AssignTransferService);
    now = Date.now();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('testEquals', () => {
    beforeEach(() => {
      dateOne = new Date(now);
      dateTwo = new Date(now);
    });
    it('should return true when two numbers equal each other', () => {
      expect(service.testEquals(1, 1)).toEqual(true);
    });
    it('should return false when two numbers do not equal each other', () => {
      expect(service.testEquals(1, 2)).toEqual(false);
    });
    it('should return true when two strings equal each other', () => {
      expect(service.testEquals('1', '1')).toEqual(true);
    });
    it('should return false when two strings do not equal each other', () => {
      expect(service.testEquals('1', '2')).toEqual(false);
    });
    it('should return true when two Dates equal each other', () => {
      expect(service.testEquals(dateOne.toString(), dateTwo.toString())).toEqual(true);
    });
    it('should return false when two Dates do not equal each other', () => {
      dateTwo.setHours(dateOne.getHours() + 1);
      expect(service.testEquals(dateOne.toString(), dateTwo.toString())).toEqual(false);
    });
  });
  describe('testNotEquals', () => {
    beforeEach(() => {
      dateOne = new Date(now);
      dateTwo = new Date(now);
    });
    it('should return true when two numbers do not equal each other', () => {
      expect(service.testNotEqual(1, 2)).toEqual(true);
    });
    it('should return false when two numbers do equal each other', () => {
      expect(service.testNotEqual(1, 1)).toEqual(false);
    });
    it('should return true when two strings do not equal each other', () => {
      expect(service.testNotEqual('1', '2')).toEqual(true);
    });
    it('should return false when two strings do equal each other', () => {
      expect(service.testNotEqual('1', '1')).toEqual(false);
    });
    it('should return true when two dates do not each other', () => {
      dateTwo.setHours(dateOne.getHours() + 1);
      expect(service.testNotEqual(dateOne.toString(), dateTwo.toString())).toEqual(true);
    });
    it('should return false when two dates do equal each other', () => {
      expect(service.testNotEqual(dateOne.toString(), dateTwo.toString())).toEqual(false);
    });
  });
  describe('testGreaterThan', () => {
    beforeEach(() => {
      dateOne = new Date(now);
      dateTwo = new Date(now);
    });
    it('should return true when testValue is greater than compare value', () => {
      expect(service.testGreaterThan(2, 1)).toEqual(true);
    });
    it('should return false when testValue is equal to compare value', () => {
      expect(service.testGreaterThan(1, 1)).toEqual(false);
    });
    it('should return false when testValue is less than compare value', () => {
      expect(service.testGreaterThan(1, 2)).toEqual(false);
    });
    it('should return true when testValue date is greater than compare value date', () => {
      dateOne.setHours(dateOne.getHours() + 1);
      expect(service.testGreaterThan(dateOne, dateTwo)).toEqual(true);
    });
    it('should return false when test value date is less than compare value date', () => {
      dateTwo.setHours(dateTwo.getHours() + 1);
      expect(service.testGreaterThan(dateOne, dateTwo)).toEqual(false);
    });
  });
  describe('testGreaterOrEqualThan', () => {
    beforeEach(() => {
      dateOne = new Date(now);
      dateTwo = new Date(now);
    });
    it('should return true when test value is greater than compare value', () => {
      expect(service.testGreaterOrEqualThan(2, 1)).toEqual(true);
    });
    it('should return true when test value is equal to compare value', () => {
      expect(service.testGreaterOrEqualThan(1, 1)).toEqual(true);
    });
    it('shoudl return false when test value is less than compare value', () => {
      expect(service.testGreaterOrEqualThan(1, 2)).toEqual(false);
    });
    it('should return true when test value date is greater than compare value date', () => {
      dateOne.setHours(dateOne.getHours() + 1);
      expect(service.testGreaterOrEqualThan(dateOne, dateTwo)).toEqual(true);
    });
    it('should return true when test value date is equal to compare value date', () => {
      expect(service.testGreaterOrEqualThan(dateOne, dateTwo)).toEqual(true);
    });
    it('should return false when test value date less than compare value date', () => {
      dateTwo.setHours(dateTwo.getHours() + 1);
      expect(service.testGreaterOrEqualThan(dateOne, dateTwo)).toEqual(false);
    });
  });
  describe('testLessThan', () => {
    beforeEach(() => {
      dateOne = new Date(now);
      dateTwo = new Date(now);
    });
    it('should return true when test value is less than compare value', () => {
      expect(service.testLessThan(1, 2)).toEqual(true);
    });
    it('should return false when test value is greater than compare value', () => {
      expect(service.testLessThan(-1, -2)).toEqual(false);
    });
    it('should return true when test value date is less than compare value date', () => {
      dateOne.setHours(dateOne.getHours() - 1);
      expect(service.testLessThan(dateOne, dateTwo)).toEqual(true);
    });
    it('should return false when test value date is greater than compare value date', () => {
      dateTwo.setHours(dateTwo.getHours() - 1);
      expect(service.testLessThan(dateOne, dateTwo)).toEqual(false);
    });
  });
  describe('testLessOrEqualThan', () => {
    beforeEach(() => {
      dateOne = new Date(now);
      dateTwo = new Date(now);
    });
    it('should return true when test value is less than compare value', () => {
      expect(service.testLessOrEqualThan(1, 2)).toEqual(true);
    });
    it('should return true when test value is equal to compare value', () => {
      expect(service.testLessOrEqualThan(1, 1)).toEqual(true);
    });
    it('should return false when test value is greater than compare value', () => {
      expect(service.testLessOrEqualThan(-1, -2)).toEqual(false);
    });
    it('should return true when test value date is less than compare value date', () => {
      dateOne.setHours(dateOne.getHours() - 1);
      expect(service.testLessOrEqualThan(1, 2)).toEqual(true);
    });
    it('should return true when test value date is equal to compare value date', () => {
      expect(service.testLessOrEqualThan(dateOne, dateTwo)).toEqual(true);
    });
    it('should return false when test value date is greater than compare value date', () => {
      dateTwo.setHours(dateTwo.getHours() - 1);
      expect(service.testLessOrEqualThan(-1, -2)).toEqual(false);
    });
  });
  describe('testContains', () => {
    it('should return true when test value contains compare value', () => {
      expect(service.testContains('some string', 'trin')).toEqual(true);
    });
    it('should return false when test value doesn\'t contain compare value', () => {
      expect(service.testContains('some string', 'xwyz')).toEqual(false);
    });
  });
  describe('testNotContain', () => {
    it('should return true when test value doesn\'t contain compare value', () => {
      expect(service.testNotContain('some string', 'xwyz')).toEqual(true);
    });
    it('should return false when test value contains compare value', () => {
      expect(service.testNotContain('some string', 'trin')).toEqual(false);
    });
  });
  describe('autoAssignTransfer', () => {
    let preSaved: PreSaveDTO;
    let mutation: PreSaveTransferMutationDTO;
    let transfer: PreSaveTransferDTO;
    let transferCondition: TransferCondition;
    let category: Category;
    let logic: Logic
    beforeEach(() => {
      logic = {
        id: '',
        createdAt: dateOne,
        editedAt: dateOne,
        transferKey: TransferKeyEnum.Amount,
        andCondition: {} as any,
        orCondition: {} as any,
        value: '5',
        conditionOperator: ConditionOperatorEnum.Equals,
        type: LogicTypeEnum.Number,
        passDifficulty: 0,
        amountUsed: 0,
        amountPassed: 0
      }
      category = {
        id: 1,
        name: 'category',
        description: '',
        createdAt: dateOne,
        editedAt: dateOne,
        order: 0,
        categoryGroup: {} as any,
        mutations: [],
        rules: []
      };
      transferCondition = {
        id: '',
        name: '',
        description: '',
        createdAt: dateOne,
        editedAt: dateOne,
        category,
        autoAssign: true,
        orLogic: [],
        andLogic: [logic]
      }
      transfer = {
        hash: 'a',
        accountNumber: 1,
        currencyCode: '$',
        valueDate: dateOne,
        transactionDate: dateOne,
        startBalance: 5,
        endBalance: 0
      };
      mutation = {
        amount: 5,
        description: 'some description',
        transfer,
      }
      preSaved = {
        transfer,
        mutation
      }
    })
    it('should return a category', () => {
      expect(service.autoAssignTransfer(preSaved, [transferCondition])).toEqual([category])
    });
    it('shouldn\'t return a category', () => {
      mutation.amount = 2
      expect(service.autoAssignTransfer(preSaved, [transferCondition])).toEqual([]);
    });
    it('should return multiple categories', () => {
      const otherLogc = {...logic, conditionOperator: ConditionOperatorEnum.GreaterThan, value: '0'};
      const otherCategory = {...category, id: 2}
      const otherTransferCondition = {...transferCondition, orLogic: [otherLogc], category: otherCategory}
      expect(service.autoAssignTransfer(preSaved, [transferCondition, otherTransferCondition])).toEqual([category, otherCategory])
    })
  });
});
