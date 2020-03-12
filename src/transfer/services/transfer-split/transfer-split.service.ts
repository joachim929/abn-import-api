import { HttpStatus, Injectable } from '@nestjs/common';
import { TransferService } from '../transfer.service';
import { SplitTransferMutationDto } from '../../dtos/split-transfer-mutation.dto';
import { NewTransferMutationChild } from '../../dtos/transfer-batch-import.dto';
import { TransferMutation } from '../../entities/transfer-mutation.entity';

@Injectable()
export class TransferSplitService extends TransferService {

  splitTransfer(body: SplitTransferMutationDto) {
    return new Promise((resolve) => {
      if (!body.patch.id) {
        this.badRequest('No transferMutationId given')
      }
      this.formatBody(body).then((formattedTransferMutations) => {
        const promises = [
          this.transferMutationRepository.save(formattedTransferMutations[0] as TransferMutation),
          this.transferMutationRepository.save(formattedTransferMutations[1] as TransferMutation),
        ];
        Promise.all(promises).then((result) => {
          resolve(result);
        });
      })
    });
  }

  /**
   * todo: This needs to move
   */
  getOneMutation(id: number): Promise<TransferMutation> {
    return this.transferMutationRepository.getOne(id);
  }

  private formatBody(body: SplitTransferMutationDto): Promise<NewTransferMutationChild[]> {
    return new Promise((resolve) => {
      this.transferMutationRepository.getOne(body.patch.mutationId).then((mutation) => {
        // todo: Still need to validate
        const splitTransferMutation = new NewTransferMutationChild(body.new, mutation);
        const patchTransferMutation = new NewTransferMutationChild(body.patch, mutation);
        if (mutation.amount !== splitTransferMutation.amount + patchTransferMutation.amount) {
          this.badRequest('Amount doesn\'t add up to original');
        }
        mutation.active = false;
        // todo: Check if this is needed
        delete mutation.children;
        this.transferMutationRepository.updateMutation(mutation).then((result) => {
          resolve([splitTransferMutation, patchTransferMutation]);
        });
      });
    });
  }
}
