import { Injectable } from '@nestjs/common';
import { TransferService } from '../transfer.service';

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

  splitTransfer(body) {
    return new Promise((resolve) => resolve('WIP'));
  }
}
