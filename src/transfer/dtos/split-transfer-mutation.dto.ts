import { TransferMutationDTO } from './transfer-mutation.dto';

export class SplitTransferMutationDto {
  patch: TransferMutationDTO;
  new: TransferMutationDTO;
}

