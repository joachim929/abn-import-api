import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransferMutation } from '../entities/transfer-mutation.entity';
import { TransferBaseService } from './transfer-base.service';
import { Transfer } from '../entities/transfer.entity';
import { TransferListParams } from '../dtos/transfer-list-params.dto';
import { Category } from '../../category/category.entity';
import { orderBy } from 'lodash';
import { TransferMutationDTO } from '../dtos/transfer-mutation.dto';

@Injectable()
export class TransferMutationService extends TransferBaseService {

  setMutationInactive(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.transferMutationRepository.getOne(id, true, false).then((response) => {
        return { ...response, active: false } as TransferMutation;
      }).then((mutation) => {
        this.transferMutationRepository.updateMutation(mutation).then(() => {
          resolve();
        }).catch(reject);
      }).catch(reject);
    });
  }

  patchTransferMutation(body: TransferMutationDTO) {
    return new Promise((resolve, reject) => {
      if (!body.mutationId) {
        throw new HttpException('Missing TransferMutation id', HttpStatus.BAD_REQUEST);
      }
      let category: Category;
      let ocMutation: TransferMutation;

      this.transferMutationRepository.getOne(body.mutationId, true, false).then((foundMutation) => {

        ocMutation = foundMutation;
        return this.getNewMutationCategory(body, ocMutation);

      }).then((categoryResponse) => {

        category = categoryResponse;
        this.validatePatchMutation(ocMutation, category, body);
        return this.transferMutationRepository.updateMutation(({ ...ocMutation, active: false }));

      }).then(() => this.createNewTransferMutation(body, ocMutation, category)
        .then((response) => resolve(new TransferMutationDTO(response.transfer, response))))
        .catch(reject);
    });
  }

  private validatePatchMutation(ocMutation: TransferMutation, category: Category, patchMutation: TransferMutationDTO) {
    new TransferMutationDTO(ocMutation.transfer, {
      ...ocMutation,
      category,
      comment: patchMutation.comment,
      description: patchMutation.description,
      amount: patchMutation.amount,
    }, true);
    if (!this.checkForPatchDifferences(patchMutation, ocMutation)) {
      throw new HttpException(`No differences found between patch object and existing object`, HttpStatus.BAD_REQUEST);
    }
  }

  getTransferMutationHistory(id: number): Promise<Transfer> {
    let transferHistory: Transfer;
    return new Promise((resolve, reject) => {
      this.transferMutationRepository.getOne(id, null, false).then((response) => {
        transferHistory = response.transfer;
        this.transferRepository.findTransferWithAllRelationships(transferHistory.id).then((transfer) => {
          resolve(transfer);
        }).catch(reject);
      });
    });
  }

  undoTransferMutationPatch(body: TransferMutationDTO) {
    let transferMutation: TransferMutation;
    let parentMutation: TransferMutation;
    return new Promise((resolve, reject) => {
      this.getOneMutation(body.mutationId).then((_transferMutation) => {
        if (!_transferMutation) {
          this.badRequest('Testing, findOneOrFail -> findOne');
        }

        transferMutation = _transferMutation;
        return this.validateUndoTransferMutation(transferMutation);

      }).then(() => {

        return this.getOneMutation(transferMutation.parent.id).then((_transferMutation) => {
          if (!_transferMutation) {
            this.badRequest('No children, shouldn\'t happen');
          }
          parentMutation = _transferMutation;
          return;
        }).catch((reason) => reject(reason));

      }).then(() => {

        this.setChildrenToInactive(parentMutation).then(() => {
          parentMutation.active = true;
          this.transferMutationRepository.updateMutation(parentMutation).then(() => {
            resolve(new TransferMutationDTO(parentMutation.transfer, parentMutation));
          });

        }).catch((reason) => reject(reason));
      }).catch((reason) => reject(reason));
    });
  }

  getOneMutation(id: number): Promise<TransferMutation> {
    return this.transferMutationRepository.getOne(id);
  }

  getByCategoryId(listParams: TransferListParams): Promise<TransferListParams> {
    return new Promise((resolve, reject) => {
      this.transferMutationRepository.getByCategoryId(listParams).then((response) => {
        const orderedMutations = orderBy(response[0].map(mutation => new TransferMutationDTO(mutation.transfer, mutation)), 'transactionDate', 'ASC');
        resolve({
          count: response[1],
          transferMutations: typeof listParams.limit === 'number' ? orderedMutations.splice(listParams.skip ? listParams.skip : 0, listParams.limit) : orderedMutations,
        });

      }).catch(reject);
    });
  }

  private checkForPatchDifferences(body: TransferMutationDTO, transferMutation: TransferMutation) {
    let editableFieldChanged = false;

    if (body?.category?.id !== transferMutation?.category?.id) {
      editableFieldChanged = true;
    }
    if (body.comment !== transferMutation.comment) {
      editableFieldChanged = true;
    }
    if (body.description !== transferMutation.description) {
      editableFieldChanged = true;
    }
    if (body.amount !== transferMutation.amount) {
      throw new HttpException('Amount can\'t be changed without splitting', HttpStatus.BAD_REQUEST);
    }
    return editableFieldChanged;
  }

  private createNewTransferMutation(inputMutation: TransferMutationDTO, ocMutation: TransferMutation, category?: Category) {
    return this.transferMutationRepository.save({
      description: inputMutation.description,
      comment: inputMutation.comment,
      amount: ocMutation.amount,
      active: true,
      category,
      transfer: ocMutation.transfer,
      parent: ocMutation,
    } as TransferMutation);
  }

  private setChildrenToInactive(transferMutation: TransferMutation): Promise<void> {
    return new Promise((resolve, reject) => {
      Promise.all(transferMutation.children.map((child) => {
        child = { ...child, active: false };
        return this.transferMutationRepository.updateMutation(child);
      }))
        .then(() => resolve())
        .catch(reject);
    });
  }

  private validateUndoTransferMutation(transferMutation: TransferMutation): Promise<void> {
    return new Promise((resolve) => {

      if (transferMutation.transfer.active === false) {
        throw new HttpException(`Transfer with id: ${transferMutation.transfer.id} is not active`, HttpStatus.BAD_REQUEST);
      }

      if (!transferMutation.parent) {
        throw new HttpException(`Nothing to undo`, HttpStatus.BAD_REQUEST);
      }

      if (transferMutation.active === false) {
        throw new HttpException(`TransferMutation with id: ${transferMutation.id} is not active`, HttpStatus.BAD_REQUEST);
      }

      resolve();
    });
  }

}
