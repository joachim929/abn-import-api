import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransferService } from '../transfer.service';
import { SplitTransferMutationDto } from '../../dtos/split-transfer-mutation.dto';
import { validate } from 'class-validator';

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
      this.validateBody(body)
        .then(() => {
          resolve('Valid body, WIP');
        }).catch(() => {
        throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);
      });
    });
  }

  private validateBody(body: SplitTransferMutationDto): Promise<void> {
    return new Promise((resolve, reject) => {
      validate(body.new).then((res) => {
        if (res.length === 0) {
          validate(body.patch).then((response) => {
            response.length === 0 ? resolve() : reject();
          });
        } else {
          reject();
        }
      });
    });
  }
}
