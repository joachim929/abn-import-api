import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SplitTransferMutationDto } from '../../dtos/split-transfer-mutation.dto';
import { TransferMutationDTO } from '../../dtos/transfer-batch-import.dto';
import { TransferMutation } from '../../entities/transfer-mutation.entity';
import { TransferBaseService } from '../transfer-base/transfer-base.service';
import { Category } from '../../../category/category.entity';
import { UpdateResult } from 'typeorm';

@Injectable()
export class TransferSplitService extends TransferBaseService {

  splitTransferMutation(body: SplitTransferMutationDto): Promise<TransferMutationDTO[]> {
    return new Promise((resolve, reject) => {
      this.transferMutationRepository.getOne(body.patch.mutationId, true, false).then((original: TransferMutation) => {
        this.validateSplitSum(original.amount, body.new.amount, body.patch.amount);

        this.getNewMutationCategory(body.new, original).then((category) => {
          const patchMutation = this.createNewTransferMutationsToSave(original, body.patch, original.category);
          const splitMutation = this.createNewTransferMutationsToSave(original, body.new, category);

          const putPromises: Promise<TransferMutation | UpdateResult>[] = [
            this.transferMutationRepository.save(patchMutation),
            this.transferMutationRepository.save(splitMutation),
            this.transferMutationRepository.updateMutation({...original, active: false})
          ];

          return Promise.all(putPromises)
        }).then((response) => {
          resolve([
            new TransferMutationDTO(original.transfer, response[0] as TransferMutation),
            new TransferMutationDTO(original.transfer, response[1] as TransferMutation)
          ]);
        }).catch(reject);
      }).catch(reject);
    });
  }

  private createNewTransferMutationsToSave(original: TransferMutation, newMutation: TransferMutationDTO, category: Category): TransferMutation {
    return {
      ...original,
      id: null,
      active: true,
      createdAt: null,
      updatedAt: null,
      children: null,
      parent: {...original},
      category,
      amount: newMutation.amount,
      comment: newMutation.comment,
      description: newMutation.description
    }
}

  private validateSplitSum(originalAmount: number, firstAmount: number, secondAmount: number): void {
    if (originalAmount !== (firstAmount + secondAmount)) {
      throw new HttpException(`Sum of ${originalAmount} + ${firstAmount} !== ${secondAmount}`, HttpStatus.BAD_REQUEST);
    }
  }

  // private getNewMutationCategory(newMutation: TransferMutationDTO, originalMutation: TransferMutation): Promise<Category> {
  //   return new Promise((resolve, reject) => {
  //     if (newMutation.category) {
  //       this.categoryRepositoryService.getCategoryById(newMutation.category.id).then((category: Category) => {
  //         resolve(category);
  //       }).catch(reject);
  //     } else {
  //       resolve(originalMutation.category || null);
  //     }
  //   })
  // }
}
