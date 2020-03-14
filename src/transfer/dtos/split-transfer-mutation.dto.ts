import { TransferMutationDTO } from './transfer-batch-import.dto';

export class SplitTransferMutationDto {
  patch: TransferMutationDTO;
  new: TransferMutationDTO;
}

