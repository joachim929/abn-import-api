import { Test, TestingModule } from '@nestjs/testing';
import { AssignTransferService } from './assign-transfer.service';
import { PreSaveDTO } from '../dtos/pre-save.dto';
import { PreSaveTransferDTO } from '../dtos/pre-save-transfer.dto';

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
  // todo: Need to figure how like is going to work as now it works like contains
  // describe('testLike', () => {
  // })
  describe('autoAssignTransfer', () => {
    it('should return no categories', () => {
      // todo: Finish writing test
      // const transfer: PreSaveTransferDTO = {
      //   hash: 'a',
      //     accountNumber: 1,
      //     currencyCode: '$',
      //     valueDate: dateOne,
      //     transactionDate: dateOne,
      //     startBalance: 5,
      //     endBalance: 0
      // };
      // const transfer: PreSaveDTO = {
      //   transfer,
      //   mutation: {
      //     amount: 2,
      //     description: 'some description',
      //
      //   }
      // }
    })
  });
});
