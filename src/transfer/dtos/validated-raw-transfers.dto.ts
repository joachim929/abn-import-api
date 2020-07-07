import { RawTransferSerializerDTO } from '../../shared/dtos/raw-invoice-json.dto';

export class ValidatedRawTransfersDTO {
  validTransfers?: RawTransferSerializerDTO[];
  invalidTransfers?: RawTransferSerializerDTO[];
}
