import { Injectable } from '@nestjs/common';
import { SplitTransferMutationDto } from '../../dtos/split-transfer-mutation.dto';
import { TransferMutationDTO } from '../../dtos/transfer-batch-import.dto';
import { TransferMutation } from '../../entities/transfer-mutation.entity';
import { validate } from 'class-validator';
import { TransferBaseService } from '../transfer-base/transfer-base.service';
import { CreateTransferMutationDTO } from '../../dtos/create-transfer-mutation.dto';

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

  private validateTransferMutations(mutations: CreateTransferMutationDTO[]): Promise<void> {
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
        this.categoryRepositoryService.getCategoryById(mutation.category.id).then((category) => {
          mutation = { ...mutation, active: false, category };

          const splitTransferMutation = new CreateTransferMutationDTO(body.new, mutation);
          const patchTransferMutation = new CreateTransferMutationDTO(body.patch, mutation);
          this.validateTransferMutations([splitTransferMutation, patchTransferMutation]).then(() => {
            if (mutation.amount !== splitTransferMutation.amount + patchTransferMutation.amount) {
              this.badRequest('Amount doesn\'t add up to original');
            }
            const promises = [
              this.transferMutationRepository.save(splitTransferMutation as unknown as TransferMutation),
              this.transferMutationRepository.save(patchTransferMutation as unknown as TransferMutation),
            ];
            Promise.all(promises).then((response) => {
              new TransferMutationDTO(mutation.transfer, response[0]);
              new TransferMutationDTO(mutation.transfer, response[1]);
              delete mutation.children;
              return this.transferMutationRepository.updateMutation(mutation).then(() => {
                resolve([
                  new TransferMutationDTO(mutation.transfer, response[0]),
                  new TransferMutationDTO(mutation.transfer, response[1]),
                ]);
              });
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }
}
