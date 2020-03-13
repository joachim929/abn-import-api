import { Injectable } from '@nestjs/common';
import { Transfer } from '../entities/transfer.entity';
import { TransferMutationDTO } from '../dtos/transfer-batch-import.dto';
import { TransferMutation } from '../entities/transfer-mutation.entity';
import { TransferBaseService } from './transfer-base/transfer-base.service';

@Injectable()
export class TransferService extends TransferBaseService {
  /**
   * todo:
   *    - No create or edit (outside of delete) functionality, transfers should only be
   *    created via imports and all values should stay constant other than relationships
   */

  getTransfer(id: string): Promise<Transfer> {
    return new Promise((resolve, reject) => {
      this.transferRepository.findOneWithMutations(id, true).then((response) => {
        resolve(response);
      }).catch((reason) => reject(reason));
    });
  }

  getTransfersWithMutations(): Promise<TransferMutationDTO[]> {
    return new Promise((resolve) => {
      this.transferRepository.getTransfersWithMutations().then((response: Transfer[]) => {
        const formattedResponse = [];

        for (const transfer of response) {
          for (const mutation of transfer.mutations) {
            formattedResponse.push(new TransferMutationDTO(transfer, mutation));
          }
        }

        resolve(formattedResponse);
      });
    });
  }

  /**
   * todo: See invoices
   */
  getFilteredTransfers(filter) {
    return new Promise((resolve) => {
      resolve('WIP');
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

  setMutationsInactive(mutations: TransferMutation[]): Promise<void> {
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
}
