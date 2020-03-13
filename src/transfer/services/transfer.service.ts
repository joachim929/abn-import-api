import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransferRepositoryService } from '../repositories/transfer-repository/transfer-repository.service';
import { TransferMutationRepositoryService } from '../repositories/transfer-mutation-repository/transfer-mutation-repository.service';
import { Transfer } from '../entities/transfer.entity';
import { TransferMutationDTO } from '../dtos/transfer-batch-import.dto';

@Injectable()
export class TransferService {
  /**
   * todo:
   *    - Create transferBaseService and make that the extendable one, this should be meant
   *    purely for transfer logic
   *    - No create or edit (outside of delete) functionality, transfers should only be
   *    created via imports and all values should stay constant other than relationships
   */

  constructor(
    protected transferRepository: TransferRepositoryService,
    protected transferMutationRepository: TransferMutationRepositoryService,
  ) {
  }

  getTransfer(id: string): Promise<Transfer> {
    return new Promise((resolve, reject) => {
      this.transferRepository.getOne(id).then((response) => {
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

  getFilteredTransfers(filter) {
    return new Promise((resolve) => {
      resolve('WIP');
    });
  }

  /**
   * todo:
   *    All relations to this transfer should be set to inactive
   *    Add active: boolean to transfer.entity
   */
  deleteTransfer(id: string): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  protected badRequest(reason: string) {
    throw new HttpException(reason, HttpStatus.BAD_REQUEST);
  }

  protected internalError(reason: string) {
    throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
