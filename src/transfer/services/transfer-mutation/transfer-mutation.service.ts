import { Injectable } from '@nestjs/common';
import { TransferService } from '../transfer.service';

@Injectable()
export class TransferMutationService extends TransferService {

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
}
