import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as hash from 'object-hash';
import { TransferRepositoryService } from '../../repositories/transfer-repository/transfer-repository.service';
import { TransferMutationRepositoryService } from '../../repositories/transfer-mutation-repository/transfer-mutation-repository.service';
import { RawInvoiceJsonDTO, RawTransferSerializerDTO } from '../../../invoice/dtos/raw-invoice-json.dto';
import { Transfer } from '../../entities/transfer.entity';
import { TransferMutation } from '../../entities/transfer-mutation.entity';
import { validate } from 'class-validator';
import {
  PreSaveDTO,
  PreSaveTransferDTO,
  TransferBatchImportDto,
  ValidatedRawTransfersDTO,
} from '../../dtos/transfer-batch-import.dto';

/**
 * todo: This is a mess, but it works
 *  feel free to clean up
 */
@Injectable()
export class TransferImportService {
  constructor(
    private transferRepository: TransferRepositoryService,
    private transferMutationRepository: TransferMutationRepositoryService,
  ) {
  }

  postExcelImport(file: RawInvoiceJsonDTO[]): Promise<TransferBatchImportDto> {
    return new Promise((resolve) => {
      // Serialize
      let existingHash = [];
      this.serializationValidation(file).then((serializedTransfers) => {
        return serializedTransfers;

      }).then((serializedTransfers) => {

        return this.validateHash(serializedTransfers).then((next) => {
          existingHash = next.existingHash;
          return next.preSavedTransferItems;
        });

      }).then((preSaved) => {

        return this.saveTransfers(preSaved).then((savedTransfers) => {
          return { savedTransfers, preSaved };
        });

      }).then((_savedTransfers) => {
        const preSaved = _savedTransfers.preSaved;
        const savedTransfers = _savedTransfers.savedTransfers;
        const savedMutations = [];
        for (let i = 0; i < savedTransfers.length; i++) {
          savedMutations.push(this.transferMutationRepository.save(preSaved[i].mutation as TransferMutation));
        }

        Promise.all(savedMutations).then((savedTransferMutations: TransferMutation[]) => {
          if (savedTransferMutations.length !== preSaved.length || savedTransferMutations.length !== savedTransfers.length) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
          }
          for (let i = 0; i < savedTransferMutations.length; i++) {
            delete savedTransferMutations[i].transfer;
            savedTransfers[i].mutations = [savedTransferMutations[i]];
          }

          resolve({
            existingTransfers: existingHash,
            savedTransfers: savedTransfers,
          });
        });
      });
    });
  }

  private saveTransfers(preSaved): Promise<Transfer[]> {
    return new Promise((resolve) => {
      const savedTransferPromise: Promise<Transfer>[] = [];
      for (let i = 0; i < preSaved.length; i++) {
        savedTransferPromise.push(this.transferRepository.save(preSaved[i].transfer as Transfer));
      }

      Promise.all(savedTransferPromise).then((savedTransfers) => {
        if (savedTransfers.length !== preSaved.length) {
          throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        resolve(savedTransfers);
      });
    });
  }

  private validateHash(serializedTransfers: ValidatedRawTransfersDTO): Promise<{
    preSavedTransferItems: PreSaveDTO[],
    existingHash: any[]
  }> {
    const preSavedTransferItems: PreSaveDTO[] = [];
    const existingHash = [];
    return new Promise((resolve) => {
      this.getHashPromises(serializedTransfers.validTransfers).then((hasHashResults) => {
        if (hasHashResults.hasHashResponse.length !== serializedTransfers.validTransfers.length) {
          throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        for (let i = 0; i < hasHashResults.hasHashResponse.length; i++) {

          if (hasHashResults.hasHashResponse[i].length === 0) {
            preSavedTransferItems.push(this.buildPreSavedTransfers(serializedTransfers.validTransfers[i], hasHashResults.usedHashes[i]));
          } else {
            existingHash.push(serializedTransfers.validTransfers[i]);
          }
        }
        resolve({ preSavedTransferItems, existingHash });
      });
    });
  }

  private getHashPromises(validTransfers: RawTransferSerializerDTO[]): Promise<{ hasHashResponse: Transfer[][], usedHashes: string[] }> {
    return new Promise((resolve) => {
      const hashPromises: Promise<Transfer[]>[] = [];
      const usedHashes = [];
      for (let i = 0; i < validTransfers.length; i++) {
        const newHash = hash(validTransfers[i]);
        usedHashes.push(newHash);
        hashPromises.push(this.transferRepository.hashExists(newHash));
      }
      Promise.all(hashPromises).then((hasHashResponse) => {
        resolve({ hasHashResponse, usedHashes });
      });
    });
  }

  private buildPreSavedTransfers(item: RawTransferSerializerDTO, hash): PreSaveDTO {
    const transfer: PreSaveTransferDTO = {
      hash,
      accountNumber: item.accountNumber,
      currencyCode: item.currencyCode,
      valueDate: item.valueDate,
      transactionDate: item.transactionDate,
      startBalance: item.startBalance,
      endBalance: item.endBalance,
    };
    return {
      transfer: transfer,
      mutation: {
        amount: item.amount,
        description: item.description,
        transfer: transfer,
      },
    };
  }

  private serializationValidation(file: RawInvoiceJsonDTO[]): Promise<ValidatedRawTransfersDTO> {
    return new Promise((resolve) => {
      const validationPromises = [];
      const serializedTransfers = [];
      const validatedTransfers = [];
      const invalidTransfers = [];
      for (const transfer of file) {
        const serializedTransfer = new RawTransferSerializerDTO(transfer);
        serializedTransfers.push(serializedTransfer);
        validationPromises.push(validate(serializedTransfer));
      }

      Promise.all(validationPromises).then((errors) => {
        for (let i = 0; i < errors.length; i++) {
          if (errors[i].length === 0) {
            validatedTransfers.push(serializedTransfers[i]);
          } else {
            invalidTransfers.push(serializedTransfers[i]);
          }
        }
        resolve({
          validTransfers: validatedTransfers,
          invalidTransfers: invalidTransfers,
        });
      });
    });

  }
}
