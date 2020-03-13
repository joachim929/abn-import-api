import { Injectable } from '@nestjs/common';
import { TransferService } from '../transfer.service';
import { TransferMutation } from '../../entities/transfer-mutation.entity';
import { TransferMutationDTO } from '../../dtos/transfer-batch-import.dto';

@Injectable()
export class TransferMutationService extends TransferService {
  // todo: Create probably not needed as the only way to create a transferMutation
  //    should be via imports

  deleteMutation(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.transferMutationRepository.getOne(id).then((response) => {
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
   *  Validation:
   *    - Check that at least amount || description || comment are different
   *      otherwise it shouldn't be allowed to be patched
   *  Make sure the relationships are done correctly
   */
  patchTransferMutation(body: TransferMutationDTO) {
    return 'WIP';
  }

  /**
   * todo:
   *    Get parent, set to active, set children of parent to active=false
   *    Validation:
   *      - PatchTransferMutation is active
   *      - Make sure to patch all parentTransferMutation's children
   */
  undoTransferMutationPatch(body: TransferMutationDTO) {
    return 'WIP'
  }

  getOneMutation(id: number): Promise<TransferMutation> {
    return this.transferMutationRepository.getOne(id);
  }
}
