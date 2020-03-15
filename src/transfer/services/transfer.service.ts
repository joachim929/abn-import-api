import { Injectable } from '@nestjs/common';
import { Transfer } from '../entities/transfer.entity';
import { TransferMutationDTO } from '../dtos/transfer-batch-import.dto';
import { TransferMutation } from '../entities/transfer-mutation.entity';
import { TransferBaseService } from './transfer-base/transfer-base.service';
import { TransferListParams } from '../dtos/transfer-list-params.dto';
import { validate } from 'class-validator';

@Injectable()
export class TransferService extends TransferBaseService {

  getTransfer(id: string): Promise<Transfer> {
    return new Promise((resolve, reject) => {
      this.transferRepository.findOneWithMutations(id, true).then((response) => {
        resolve(response);
      }).catch((reason) => reject(reason));
    });
  }

  /**
   * Debug/admin route to get all data
   */
  getTransfersWithMutations(): Promise<Transfer[]> {
    return new Promise((resolve) => {
      this.transferRepository.getTransfers().then((response: Transfer[]) => {
        resolve(response);
      });
    });
  }

  getFilteredTransfers(filter: TransferListParams) {
    let results;
    return new Promise((resolve, reject) => {
      validate(filter).then((response) => {

        if (response.length !== 0) {
          reject('Bad filter params');
        }

        return this.getMinMax().then((_results) => {
          results = _results;
          return;
        }).then(() => {
          return this.transferRepository.getFilteredTransfersWithMutations(filter);
        }).then((response) => {
          results.count = response[1];
          results.transferMutations = [];
          const startDate = filter.startDate ? new Date(Number(filter.startDate)) : null;
          const endDate = filter.endDate ? new Date(Number(filter.endDate)) : null;


          const transfers: Transfer[] = response[0];
          for (const transfer of transfers) {
            if (!this.filterTransferMutationsByDate(transfer.transactionDate, startDate, endDate)) {
              if (results.count > transfer.mutations.length) {
                results.count -= transfer.mutations.length;
              } else {
                this.internalError('Negative count?');
              }
              continue;
            }
            for (const mutation of transfer.mutations) {
              results.transferMutations.push(new TransferMutationDTO(transfer, mutation));
            }
          }
          const limit = filter.limit ? filter.limit : 20;
          if (results.transferMutations.length > limit) {
            results.transferMutations.splice(limit);
          }

          resolve(results);
        }).catch((reason) => reject(reason));
      }).catch((reason) => reject(reason));
    });
  }

  deleteTransfer(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.transferRepository.findOne(id).then((transfer) => {
        transfer.active = false;
        this.transferRepository.findOneWithMutations(id).then((transferWithMutations) => {
          return this.setMutationsInactive(transferWithMutations.mutations);
        }).then(() => {
          resolve(this.transferRepository.updateTransfer(transfer));
        }).catch((reason) => reject(reason));
      }).catch((reason) => reject(reason));
    });
  }

  /**
   * todo:
   *    Remember to splice return to limit the filter limit
   *    And remove limit from query
   */
  private filterTransferMutationsByDate(transactionDate: Date, startDate?: Date, endDate?: Date): boolean {
    let transferValid = true;
    if (startDate && startDate.getTime() >= transactionDate.getTime()) {
      transferValid = false;
    }

    if (endDate && endDate.getTime() <= transactionDate.getTime()) {
      transferValid = false;
    }

    return transferValid;
  }

  private setMutationsInactive(mutations: TransferMutation[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const mutationPromises = [];
      for (const mutation of mutations) {
        if (mutation.active === false) {
          continue;
        }
        mutation.active = false;
        mutationPromises.push(this.transferMutationRepository.updateMutation(mutation));
      }
      Promise.all(mutationPromises).then(() => {
        resolve();
      }).catch((reason) => reject(reason));
    });
  }

  private getMinMax(): Promise<TransferListParams> {
    const results: TransferListParams = {};
    return new Promise((resolve) => {
      this.transferMutationRepository.getMaxAmount().then((maxResult) => {
        this.transferMutationRepository.getMinAmount().then((minResult) => {
          results.maxAmount = maxResult.max;
          results.minAmount = minResult.min;
          resolve(results);
        });
      });
    });
  }
}
