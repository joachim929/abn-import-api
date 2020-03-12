import { Injectable } from '@nestjs/common';
import { TransferService } from '../transfer.service';
import { SplitTransferMutationDto } from '../../dtos/split-transfer-mutation.dto';
import { NewTransferMutationChild } from '../../dtos/transfer-batch-import.dto';
import { TransferMutation } from '../../entities/transfer-mutation.entity';

@Injectable()
export class TransferSplitService extends TransferService {

  splitTransfer(body: SplitTransferMutationDto) {
    return new Promise((resolve, reject) => {
      if (!body.patch.id || !body.new.id) {
        this.badRequest('No transferMutationId given');
      }
      this.formatBody(body).then((formattedTransferMutations) => {
        resolve(formattedTransferMutations);
      }).catch((reason) => reject(reason));
    });
  }

  private formatBody(body: SplitTransferMutationDto): Promise<NewTransferMutationChild[]> {
    return new Promise((resolve, reject) => {
      this.transferMutationRepository.getOne(body.patch.mutationId).then((mutation) => {
        // todo: Still need to validate

        mutation.active = false;
        const splitTransferMutation = new NewTransferMutationChild(body.new, mutation);
        const patchTransferMutation = new NewTransferMutationChild(body.patch, mutation);
        if (mutation.amount !== splitTransferMutation.amount + patchTransferMutation.amount) {
          this.badRequest('Amount doesn\'t add up to original');
        }
        const promises = [
          this.transferMutationRepository.save(splitTransferMutation as TransferMutation),
          this.transferMutationRepository.save(patchTransferMutation as TransferMutation),
        ];
        Promise.all(promises).then((response) => {
          delete mutation.children;
          return this.transferMutationRepository.updateMutation(mutation).then((result) => {
            resolve([splitTransferMutation, patchTransferMutation]);
          });
        });
      }).catch((reason) => reject(reason));
    });
  }
}
