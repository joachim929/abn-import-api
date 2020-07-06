import { RawInvoiceJsonDTO, RawTransferSerializerDTO } from '../../shared/dtos/raw-invoice-json.dto';

export interface ImportTransfersDTO {
  unSerialized: RawInvoiceJsonDTO[];
  serialized: RawTransferSerializerDTO[];
  force?: boolean;
}
