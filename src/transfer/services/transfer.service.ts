import { Injectable } from '@nestjs/common';
import { TransferRepositoryService } from '../repositories/transfer-repository/transfer-repository.service';
import { TransferMutationRepositoryService } from '../repositories/transfer-mutation-repository/transfer-mutation-repository.service';
import { RawInvoiceJsonDTO } from '../../invoice/dtos/raw-invoice-json.dto';
import { Transfer } from '../entities/transfer.entity';
import * as hash from 'object-hash';

@Injectable()
export class TransferService {
  constructor(
    private transferRepository: TransferRepositoryService,
    private transferMutationRepository: TransferMutationRepositoryService,
  ) {
  }

  getTransfers() {
    return new Promise((resolve) => {
      resolve('WIP');
    });
  }

  postMultiExcel(file: RawInvoiceJsonDTO[]) {
    return new Promise((resolve) => {
      const formattedData = this.serializeRawJson(file);
      const transferPromises = [];
      for (const datum of formattedData) {
        // todo: Check if has exists
        this.transferRepository.save(datum.transfer).then(savedTransfer => {
          datum.mutation.transfer = savedTransfer;
          transferPromises.push(this.transferMutationRepository.save(datum.mutation));
        });
      }

      Promise.all(transferPromises).then((res) => {
        console.log(res);
        this.transferMutationRepository.get().then(transfers => resolve(transfers));
      });
    });
  }

  private serializeRawJson(rawJson: RawInvoiceJsonDTO[]) {
    const formattedTransfers = [];
    for (const transfer of rawJson) {

      formattedTransfers.push({
        transfer: {
          hash: hash(transfer),
          accountNumber: transfer.Rekeningnummer,
        },
        mutation: {
          currencyCode: transfer.Muntsoort,
          transactionDate: new Date().setUTCFullYear(
            Number(String(transfer.Transactiedatum).slice(0, 4)),
            Number(String(transfer.Transactiedatum).slice(4, 6)),
            Number(String(transfer.Transactiedatum).slice(6, 8)),
          ),
          valueDate: new Date().setUTCFullYear(
            Number(String(transfer.Rentedatum).slice(0, 4)),
            Number(String(transfer.Rentedatum).slice(4, 6)),
            Number(String(transfer.Rentedatum).slice(6, 8)),
          ),
          startBalance: transfer.Beginsaldo,
          endBalance: transfer.Eindsaldo,
          description: transfer.Omschrijving,
        },
      });
    }

    return formattedTransfers;
  }
}
