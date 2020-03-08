import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  getDebug() {
    return new Promise((resolve) => {
      resolve(this.transferRepository.getTransfersWithMutations());
    });
  }

  getTransfers() {
    return new Promise((resolve) => {
      resolve('WIP');
    });
  }

  postMultiExcel(file: RawInvoiceJsonDTO[]) {
    return new Promise((resolve) => {
      this.serializeRawJson(file).then((formattedData) => {
        const transferPromises = [];

        for (const datum of formattedData) {
          this.transferRepository.save(datum.transfer).then(savedTransfer => {
            datum.mutation.transfer = savedTransfer;
            transferPromises.push(this.transferMutationRepository.save(datum.mutation));
          });
        }

        Promise.all(transferPromises).then((res) => {
          resolve(this.transferRepository.getTransfersWithMutations());
        });
      });
    });
  }

  private serializeRawJson(rawJson: RawInvoiceJsonDTO[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const formattedTransfers = [];
      const promises = [];
      for (let i = 0; i < rawJson.length; i++) {
        const newHash = hash(rawJson[i]);
        promises.push(this.transferRepository.hashExists(newHash));
      }

      Promise.all(promises).then((response) => {
        if (response.length !== rawJson.length) {
          throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        for (let i = 0; i < response.length; i++) {
          if (response[i].length === 0) {
            formattedTransfers.push({
              transfer: {
                hash: hash(rawJson[i]),
                accountNumber: rawJson[i].Rekeningnummer,
              },
              mutation: this.rawMutationToMutation(rawJson[i]),
            });
          }
        }
        resolve(formattedTransfers);
      });
    });
  }

  private rawMutationToMutation(mutation: RawInvoiceJsonDTO) {
    return {
      currencyCode: mutation.Muntsoort,
      transactionDate: new Date().setUTCFullYear(
        Number(String(mutation.Transactiedatum).slice(0, 4)),
        Number(String(mutation.Transactiedatum).slice(4, 6)),
        Number(String(mutation.Transactiedatum).slice(6, 8)),
      ),
      valueDate: new Date().setUTCFullYear(
        Number(String(mutation.Rentedatum).slice(0, 4)),
        Number(String(mutation.Rentedatum).slice(4, 6)),
        Number(String(mutation.Rentedatum).slice(6, 8)),
      ),
      startBalance: mutation.Beginsaldo,
      endBalance: mutation.Eindsaldo,
      description: mutation.Omschrijving,
    };
  }
}
