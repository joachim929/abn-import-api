import { IncomingTransferMutation, TransferMutationDTO } from './transfer-batch-import.dto';

export class SplitTransferMutationDto {
  patch: TransferMutationDTO;
  new: TransferMutationDTO;
}

export class ValidIncomingTransferMutations {
  patch: IncomingTransferMutation;
  new: IncomingTransferMutation;
}
