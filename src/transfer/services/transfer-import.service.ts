import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as hash from 'object-hash';
import { RawInvoiceJsonDTO, RawTransferSerializerDTO } from '../../shared/dtos/raw-invoice-json.dto';
import { Transfer } from '../entities/transfer.entity';
import { TransferMutation } from '../entities/transfer-mutation.entity';
import { validate } from 'class-validator';
import {
  PreSaveDTO,
  PreSaveTransferDTO,
  TransferBatchImportDto, TransferMutationDTO,
  ValidatedRawTransfersDTO,
} from '../dtos/transfer-batch-import.dto';
import { TransferBaseService } from './transfer-base.service';
import { TransferRepositoryService } from '../repositories/transfer-repository.service';
import { TransferMutationRepositoryService } from '../repositories/transfer-mutation-repository.service';
import { CategoryRepositoryService } from '../../category/repositories/category-repository.service';
import { RulesService } from '../../rules/services/rules.service';
import { AssignService } from './assign.service';

@Injectable()
export class TransferImportService extends TransferBaseService {
  constructor(
    transferRepository: TransferRepositoryService,
    transferMutationRepository: TransferMutationRepositoryService,
    categoryRepositoryService: CategoryRepositoryService,
    private rulesService: RulesService,
    private assignService: AssignService
  ) {
    super(
      transferRepository,
      transferMutationRepository,
      categoryRepositoryService,
    );
  }

  postExcelImport(file: RawInvoiceJsonDTO[]): Promise<TransferBatchImportDto> {
    return new Promise((resolve) => {
      // Serialize
      let existingHash = [];
      Promise.all([this.rulesService.getAll(), this.serializationValidation(file)]).then(([rules, serializedTransfers]) => {
        return this.validateHash(serializedTransfers)
          .then((next) => {
            existingHash = next.existingHash;
            return { preSavedTransfers: next.preSavedTransferItems, rules };
          });

      }).then(({preSavedTransfers, rules}) => {
        return preSavedTransfers.map((transfer) => {
          // todo: Make sure category gets autoAssigned
          const category = this.assignService.autoAssignTransfer(transfer, rules);
          if (category) {
            transfer.mutation.category = category;
          }
          return transfer;
        });
      }).then((preSaved) => {
        return this.savedTransfers(preSaved).then((savedTransferMutations) => {

          const transferMutations: TransferMutationDTO[] = [];

          for (const transferMutation of savedTransferMutations) {
            transferMutations.push(new TransferMutationDTO(transferMutation.transfer, transferMutation));
          }

          return transferMutations;
        });

      }).then((savedTransfers) => {
        resolve({
          existingTransfers: existingHash,
          savedTransfers,
        });
      });
    });
  }

  postExisting(existing: RawTransferSerializerDTO[]): Promise<TransferMutationDTO[]> {
    return new Promise((resolve, reject) => {
      const items: PreSaveDTO[] = existing.map((transfer) => this.buildPreSavedTransfers(transfer, hash(transfer), true));
      this.savedTransfers(items)
        .then((result) => result.map((transferMutation) =>
          new TransferMutationDTO(transferMutation.transfer, transferMutation)))
        .then((response) => resolve(response))
        .catch(reject);
    });
  }

  private savedTransfers(preSaveDTOS: PreSaveDTO[]): Promise<TransferMutation[]> {
    return new Promise((resolve) => {
      const savedTransfers: Promise<TransferMutation>[] = [];
      for (let i = 0; i < preSaveDTOS.length; i++) {
        savedTransfers.push(this.transferRepository.save(preSaveDTOS[i].transfer as Transfer)
          // Todo: Create separate interfaces
          .then(() => this.transferMutationRepository.save(preSaveDTOS[i].mutation as TransferMutation)));
      }

      Promise.all(savedTransfers).then((response) => {
        resolve(response);
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

  private buildPreSavedTransfers(item: RawTransferSerializerDTO, hash, forced = false): PreSaveDTO {
    const transfer: PreSaveTransferDTO = {
      hash,
      accountNumber: item.accountNumber,
      currencyCode: item.currencyCode,
      valueDate: item.valueDate,
      transactionDate: item.transactionDate,
      startBalance: item.startBalance,
      endBalance: item.endBalance,
      forced,
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
