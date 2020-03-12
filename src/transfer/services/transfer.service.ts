import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransferRepositoryService } from '../repositories/transfer-repository/transfer-repository.service';
import { TransferMutationRepositoryService } from '../repositories/transfer-mutation-repository/transfer-mutation-repository.service';
import { Transfer } from '../entities/transfer.entity';
import { TransferMutationDTO } from '../dtos/transfer-batch-import.dto';

@Injectable()
export class TransferService {
  constructor(
    protected transferRepository: TransferRepositoryService,
    protected transferMutationRepository: TransferMutationRepositoryService,
  ) {
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

  protected badRequest(reason: string) {
    throw new HttpException(reason, HttpStatus.BAD_REQUEST);
  }

  protected internalError(reason: string) {
    throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
