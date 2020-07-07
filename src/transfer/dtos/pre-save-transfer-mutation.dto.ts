import { Category } from '../../category/category.entity';
import { PreSaveTransferDTO } from './pre-save-transfer.dto';

export class PreSaveTransferMutationDTO {
  amount: number;
  description: string;
  transfer?: PreSaveTransferDTO;
  category?: Category;
}
