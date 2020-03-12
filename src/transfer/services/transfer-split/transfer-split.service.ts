import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransferService } from '../transfer.service';
import { SplitTransferMutationDto, ValidIncomingTransferMutations } from '../../dtos/split-transfer-mutation.dto';
import { validate } from 'class-validator';
import { IncomingTransferMutation, NewTransferMutationChild } from '../../dtos/transfer-batch-import.dto';
import { Transfer } from '../../entities/transfer.entity';
import { TransferMutation } from '../../entities/transfer-mutation.entity';

/**
 * todo: Before I can really get started on this I need to decide how the front end gets data
 *  If I send a different object to the front-end compared to how it looks in the back end,
 *  the object I can expect to recieve will be different
 *
 *    Things the front-end should see (everything)
 *
 *    Things needed from original TransferMutation:
 *      - id
 *      - rest I can pull from DB
 *
 *    Things needed from new TransferMutations:
 *      - id
 *      - description
 *      - comment
 *      - amount
 */

@Injectable()
export class TransferSplitService extends TransferService {

  splitTransfer(body: SplitTransferMutationDto) {
    return new Promise((resolve) => {
      if (!body.patch.id) {
        throw new HttpException('No transferMutationId given', HttpStatus.BAD_REQUEST);
      }
      this.formatBody(body).then((formattedTransferMutations) => {
        console.log(formattedTransferMutations);
        resolve();
        return;
        const promises = [
          this.transferMutationRepository.save(formattedTransferMutations[0] as TransferMutation),
          this.transferMutationRepository.save(formattedTransferMutations[1] as TransferMutation),
        ];
        Promise.all(promises).then((result) => {
          console.log(result);
          resolve(result);
        });
      });

      // this.validateBody(body).then((validBody) => {
      //   patchMutation = validBody.patch;
      //   newMutation = validBody.new;
      //   return this.getTransfer(validBody.patch.id);
      // }).then((transfer) => {
      //   this.getTransferMutation(patchMutation.mutationId).then((result) => resolve(result));
      //   /**
      //    * todo:
      //    *  Add patch and new to transferMutation children,
      //    *  if other children, set inactive
      //    *  Maybe re-write how patch and new are represented as they can't be
      //    *  inserted how they are at the moment
      //    */
      // });
    }).catch(() => {
      throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);
    });
  }

  private formatBody(body: SplitTransferMutationDto): Promise<NewTransferMutationChild[]> {
    return new Promise((resolve) => {
      this.transferMutationRepository.getOne(body.patch.mutationId).then((mutation) => {
        const splitTransferMutation = new NewTransferMutationChild(body.new, mutation);
        console.log(splitTransferMutation);
        const patchTransferMutation = new NewTransferMutationChild(body.patch, mutation);
        console.log(patchTransferMutation);
        resolve([splitTransferMutation, patchTransferMutation]);
      });
    });
  }

  private getTransferMutation(id: number): Promise<TransferMutation> {
    return new Promise((resolve) => {
      this.transferMutationRepository.getOne(id).then((result) => resolve(result));
    });
  }

  private getTransfer(id: string): Promise<Transfer> {
    return new Promise((resolve) => {
      this.transferRepository.getOne(id).then((result) => resolve(result));
    });
  }

  private validateBody(body: SplitTransferMutationDto): Promise<ValidIncomingTransferMutations> {
    return new Promise((resolve, reject) => {
      validate(new IncomingTransferMutation(body.patch)).then((res) => {
        if (res.length === 0) {
          validate(new IncomingTransferMutation(body.new)).then((response) => {
            response.length === 0 ? resolve(body) : reject();
          }).catch(() => reject());
        } else {
          reject();
        }
      }).catch(() => reject());
    });
  }
}
