import { Injectable } from '@nestjs/common';
import { SplitTransferMutationDto } from '../../dtos/split-transfer-mutation.dto';
import { NewTransferMutationChild, TransferMutationDTO } from '../../dtos/transfer-batch-import.dto';
import { TransferMutation } from '../../entities/transfer-mutation.entity';
import { validate } from 'class-validator';
import { TransferBaseService } from '../transfer-base/transfer-base.service';

@Injectable()
export class TransferSplitService extends TransferBaseService {

  splitTransferMutation(body: SplitTransferMutationDto): Promise<TransferMutationDTO[]> {
    return new Promise((resolve, reject) => {
      if (!body.patch.id || !body.new.id) {
        this.badRequest('No transferMutationId given');
      }
      this.formatBody(body).then((formattedTransferMutations) => {
        resolve(formattedTransferMutations);
      }).catch((reason) => reject(reason));
    });
  }

  private validateTransferMutations(mutations: NewTransferMutationChild[]): Promise<void> {
    return new Promise((resolve, reject) => {
      validate(mutations[0]).then((errors) => {
        if (errors.length > 0) {
          reject(this.badRequest('Invalid split params'));
        } else {
          return;
        }
      }).then(() => {
        validate(mutations[1]).then((errors) => {
          if (errors.length > 0) {
            reject(this.badRequest('Invalid split params'));
          } else {
            resolve();
          }
        });
      });
    });
  }

  private formatBody(body: SplitTransferMutationDto): Promise<TransferMutationDTO[]> {
    return new Promise((resolve, reject) => {
      this.transferMutationRepository.getOne(body.patch.mutationId).then((mutation) => {

        mutation.active = false;
        const splitTransferMutation = new NewTransferMutationChild(body.new, mutation);
        const patchTransferMutation = new NewTransferMutationChild(body.patch, mutation);
        this.validateTransferMutations([splitTransferMutation, patchTransferMutation]).then(() => {
          if (mutation.amount !== splitTransferMutation.amount + patchTransferMutation.amount) {
            this.badRequest('Amount doesn\'t add up to original');
          }
          const promises = [
            this.transferMutationRepository.save(splitTransferMutation as TransferMutation),
            this.transferMutationRepository.save(patchTransferMutation as TransferMutation),
          ];
          Promise.all(promises).then((response) => {
            new TransferMutationDTO(mutation.transfer, response[0]);
            new TransferMutationDTO(mutation.transfer, response[1]);
            delete mutation.children;
            return this.transferMutationRepository.updateMutation(mutation).then((result) => {
              resolve([
                new TransferMutationDTO(mutation.transfer, response[0]),
                new TransferMutationDTO(mutation.transfer, response[1]),
              ]);
            });
          });
        }).catch((reason) => reject(reason));
      }).catch((reason) => reject(reason));
    });
  }
}
