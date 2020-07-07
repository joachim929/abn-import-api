import { CategoryDTO } from '../../category/dtos/category.dto';
import { PreSaveTransferMutationDTO } from './pre-save-transfer-mutation.dto';
import { PreSaveTransferDTO } from './pre-save-transfer.dto';

export class PreSaveDTO {
  transfer: PreSaveTransferDTO;
  mutation: PreSaveTransferMutationDTO;
  categoryHints?: CategoryDTO[];
}
