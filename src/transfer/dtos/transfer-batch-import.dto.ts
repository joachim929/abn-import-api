import { RawTransferSerializerDTO } from '../../shared/dtos/raw-invoice-json.dto';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { TransferMutationDTO } from './transfer-mutation.dto';

export class TransferBatchImportDto {
  @ApiModelProperty({ type: [RawTransferSerializerDTO] })
  existingTransfers?: RawTransferSerializerDTO[];
  @ApiModelProperty({ type: [TransferMutationDTO] })
  savedTransfers?: TransferMutationDTO[];
}

