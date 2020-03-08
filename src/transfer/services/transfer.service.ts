import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransferRepositoryService } from '../repositories/transfer-repository/transfer-repository.service';
import { TransferMutationRepositoryService } from '../repositories/transfer-mutation-repository/transfer-mutation-repository.service';
import { RawInvoiceJsonDTO } from '../../invoice/dtos/raw-invoice-json.dto';
import { Transfer } from '../entities/transfer.entity';
import * as hash from 'object-hash';
import { TransferMutation } from '../entities/transfer-mutation.entity';

@Injectable()
export class TransferService {
  constructor(
    private transferRepository: TransferRepositoryService,
    private transferMutationRepository: TransferMutationRepositoryService,
  ) {
  }

  getTransfersWithMutations(): Promise<Transfer[]> {
    return new Promise((resolve) => {
      resolve(this.transferRepository.getTransfersWithMutations());
    });
  }

  postMultiExcel(file: RawInvoiceJsonDTO[]): Promise<Transfer[]> {
    return new Promise((resolve) => {
      this.serializeRawJson(file).then((formattedData) => {
        const transferMutationPromises = [];
        const transferPromises = [];
        for (const datum of formattedData) {
          transferPromises.push(this.transferRepository.save(datum.transfer));
        }

        Promise.all(transferPromises).then((savedTransfers: Transfer[]) => {
          if (savedTransfers.length !== formattedData.length) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
          }
          for (let i = 0; i < formattedData.length; i++) {
            formattedData[i].mutation.transfer = savedTransfers[i];
            transferMutationPromises.push(this.transferMutationRepository.save(formattedData[i].mutation));
          }

          Promise.all(transferMutationPromises).then((savedMutations: TransferMutation[]) => {
            const savedResponse: Transfer[] = [];
            for (const savedMutation of savedMutations) {
              const savedTransfer: Transfer = savedMutation.transfer;
              savedTransfer.mutations = [{
                startBalance: savedMutation.startBalance,
                endBalance: savedMutation.endBalance,
                description: savedMutation.description,
                comment: savedMutation.comment,
                id: savedMutation.id,
                active: savedMutation.active,
                createdAt: savedMutation.createdAt,
                updatedAt: savedMutation.updatedAt,
                transfer: null,
                parent: null,
                children: null,
              }];
              savedResponse.push(savedTransfer);
            }
            resolve(savedResponse);
          });
        });
      });
    });
  }

  private serializeRawJson(rawJson: RawInvoiceJsonDTO[]): Promise<any[]> {
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
              transfer: this.rawTransferToTransfer(rawJson[i]),
              mutation: this.rawTransferToTransferMutation(rawJson[i]),
            });
          }
        }
        resolve(formattedTransfers);
      });
    });
  }

  private rawTransferToTransfer(rawTransfer: RawInvoiceJsonDTO): object {
    return {
      hash: hash(rawTransfer),
      accountNumber: rawTransfer.Rekeningnummer,
      currencyCode: rawTransfer.Muntsoort,
      transactionDate: new Date().setUTCFullYear(
        Number(String(rawTransfer.Transactiedatum).slice(0, 4)),
        Number(String(rawTransfer.Transactiedatum).slice(4, 6)),
        Number(String(rawTransfer.Transactiedatum).slice(6, 8)),
      ),
      valueDate: new Date().setUTCFullYear(
        Number(String(rawTransfer.Rentedatum).slice(0, 4)),
        Number(String(rawTransfer.Rentedatum).slice(4, 6)),
        Number(String(rawTransfer.Rentedatum).slice(6, 8)),
      ),
    };
  }

  private rawTransferToTransferMutation(mutation: RawInvoiceJsonDTO): object {
    return {
      startBalance: mutation.Beginsaldo,
      endBalance: mutation.Eindsaldo,
      description: mutation.Omschrijving,
    };
  }
}
