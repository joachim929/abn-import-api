import { Injectable } from '@nestjs/common';
import { TransferRepositoryService } from '../repositories/transfer-repository/transfer-repository.service';
import { TransferMutationRepositoryService } from '../repositories/transfer-mutation-repository/transfer-mutation-repository.service';
import { Transfer } from '../entities/transfer.entity';

@Injectable()
export class TransferService {
  constructor(
    protected transferRepository: TransferRepositoryService,
    protected transferMutationRepository: TransferMutationRepositoryService,
  ) {
  }

  getTransfersWithMutations(): Promise<Transfer[]> {
    return new Promise((resolve) => {
      resolve(this.transferRepository.getTransfersWithMutations());
    });
  }
}
