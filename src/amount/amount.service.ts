import { Injectable } from '@nestjs/common';
import { AmountRepositoryService } from './amount-repository/amount-repository.service';
import { Amount } from './amount.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AmountDTO } from './dtos/amount.dto';

@Injectable()
export class AmountService {

  constructor(private repository: AmountRepositoryService) {
  }

  getAmountById(id: number): Promise<AmountDTO> {
    return new Promise((resolve, reject) => {
      if (typeof id === 'number') {
        this.repository.getAmountById(id).then((response: Amount[]) => {
          if (response.length === 1) {
            resolve(new AmountDTO(response[0]));
          } else {
            response.length === 0 ? reject('None found') : reject('Too many found');
          }
        });
      } else {
        reject('Id needs to be a number');
      }
    });
  }

  getAmountByRuleId(ruleId: number): Promise<AmountDTO[]> {
    return new Promise((resolve, reject) => {
      if (typeof ruleId !== 'number') {
        reject('ruleId needs to be a number');
      }

      this.repository.getAmountByRuleId(ruleId).then((response: Amount[]) => {
        const amountReturn: AmountDTO[] = [];
        for (const amount of response) {
          amountReturn.push(new AmountDTO(amount));
        }
        resolve(amountReturn);
      });
    });
  }

  patchAmount(amount: Amount) {
    return new Promise(resolve => {
      // todo: Figure out what to resolve
      this.repository.patchAmount(amount.id, amount).then((response: UpdateResult) => {
        resolve(response);
      });
    });
  }

  deleteAmount(id: number): Promise<void> {
    return new Promise(resolve => {
      this.repository.deleteAmount(id).then(() => resolve());
    });
  }

  createAmount(amount: Amount): Promise<AmountDTO> {
    return new Promise((resolve) => {
      this.repository.createAmount(amount).then((response: Amount) => resolve(new AmountDTO(response)));
    });
  }

}
