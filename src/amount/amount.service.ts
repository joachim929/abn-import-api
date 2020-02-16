import { Injectable } from '@nestjs/common';
import { AmountRepositoryService } from './amount-repository/amount-repository.service';
import { Amount } from './amount.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class AmountService {

  constructor(private repository: AmountRepositoryService) {
  }

  getAmountById(id: number): Promise<Amount> {
    return new Promise((resolve, reject) => {
      if (typeof id === 'number') {
        this.repository.getAmountById(id).then((response: Amount[]) => {
          if (response.length === 1) {
            resolve(response[0]);
          } else {
            response.length === 0 ? reject('None found') : reject('Too many found');
          }
        });
      } else {
        reject('Id needs to be a number');
      }
    });
  }

  getAmountByRuleId(ruleId: number): Promise<Amount[]> {
    return new Promise((resolve, reject) => {
      if (typeof ruleId !== 'number') {
        reject('ruleId needs to be a number');
      }

      this.repository.getAmountByRuleId(ruleId).then((response: Amount[]) => {
        resolve(response);
      });
    });
  }

  patchAmount(amount: Amount) {
    return new Promise((resolve, reject) => {
      this.repository.patchAmount(amount.id, amount).then((response: UpdateResult) => {
        resolve(response);
      });
    });
  }

  deleteAmount(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.repository.deleteAmount(id).then((response: DeleteResult) => {
        resolve();
      });
    });
  }

  createAmount(amount: Amount): Promise<Amount> {
    return new Promise((resolve) => {
      this.repository.createAmount(amount).then((response: Amount) => resolve(response));
    });
  }

}
