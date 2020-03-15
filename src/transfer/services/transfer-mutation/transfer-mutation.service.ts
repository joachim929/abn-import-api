import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransferMutation } from '../../entities/transfer-mutation.entity';
import { TransferMutationDTO } from '../../dtos/transfer-batch-import.dto';
import { TransferBaseService } from '../transfer-base/transfer-base.service';
import { validate } from 'class-validator';

@Injectable()
export class TransferMutationService extends TransferBaseService {
  // todo: Create probably not needed as the only way to create a transferMutation
  //    should be via imports

  deleteMutation(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.transferMutationRepository.getOne(id, true, false).then((response) => {
        response.active = false;
        return response;
      }).then((mutation) => {
        this.transferMutationRepository.updateMutation(mutation).then((response) => {
          resolve();
        }).catch(reason => reject(reason));
      }).catch(reason => reject(reason));
    });
  }

  /**
   * todo:
   *  Test it.
   *  Validation:
   *    - Check that at least amount || description || comment are different
   *      otherwise it shouldn't be allowed to be patched
   *  Make sure the relationships are done correctly
   */
  patchTransferMutation(body: TransferMutationDTO) {
    let transferMutation: TransferMutation;
    return new Promise((resolve, reject) => {
      validate(body).then((errors) => {
        if (errors.length > 0) {
          this.badRequest('Invalid transferMutationDTO params');
        }
        return;

      }).then(() => {
        this.transferMutationRepository.getOne(body.mutationId, true, false)
          .then((_transferMutation) => {
            transferMutation = _transferMutation;

            if (this.checkForPatchDifferences(body, transferMutation)) {
              transferMutation.active = false;
              return this.transferMutationRepository.updateMutation(transferMutation);
            } else {
              this.badRequest('No changes found');
            }

          }).then(() => {
          const newMutation: TransferMutation = new TransferMutation();
          newMutation.description = body.description;
          newMutation.comment = body.comment;
          newMutation.amount = transferMutation.amount;
          newMutation.active = true;
          newMutation.categoryId = body.categoryId;
          newMutation.transfer = transferMutation.transfer;
          newMutation.parent = transferMutation;
          this.transferMutationRepository.save(newMutation).then((response) => {
            resolve(new TransferMutationDTO(transferMutation.transfer, response));
          });
        }).catch(reason => reject(reason));
      }).catch(reason => reject(reason));
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

        this.setChildrenToInactive(parentMutation).then((result) => {
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

  private checkForPatchDifferences(body: TransferMutationDTO, transferMutation: TransferMutation) {
    let editableFieldChanged = false;

    if (body.categoryId !== transferMutation.categoryId) {
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

  private setChildrenToInactive(transferMutation: TransferMutation): Promise<void> {
    return new Promise((resolve, reject) => {
      const childPromises = [];
      for (const child of transferMutation.children) {
        child.active = false;
        childPromises.push(this.transferMutationRepository.updateMutation(child));
      }

      Promise.all(childPromises).then(() => {
        resolve();
      }).catch((reason) => reject(reason));
    });
  }

  private validateUndoTransferMutation(transferMutation: TransferMutation): Promise<void> {
    return new Promise((resolve, reject) => {

      if (transferMutation.transfer.active === false) {
        reject(`Transfer with id: ${transferMutation.transfer.id} is not active`);
      }

      if (!transferMutation.parent) {
        reject(`Nothing to undo`);
      }

      if (transferMutation.active === false) {
        reject(`TransferMutation with id: ${transferMutation.id} is not active`);
      }

      resolve();
    });
  }
}
