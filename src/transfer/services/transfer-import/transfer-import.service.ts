import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as hash from 'object-hash';
import { TransferRepositoryService } from '../../repositories/transfer-repository/transfer-repository.service';
import { TransferMutationRepositoryService } from '../../repositories/transfer-mutation-repository/transfer-mutation-repository.service';
import { RawInvoiceJsonDTO, RawTransferSerializerDTO } from '../../../invoice/dtos/raw-invoice-json.dto';
import { Transfer } from '../../entities/transfer.entity';
import { TransferMutation } from '../../entities/transfer-mutation.entity';
import { validate } from 'class-validator';


// https://docs.nestjs.com/pipes
export class ValidatedRawTransfersDTO {
  validTransfers?: RawTransferSerializerDTO[];
  invalidTransfers?: RawTransferSerializerDTO[];
}

export class PreSaveTransferDTO {
  hash: string;
  accountNumber: number;
  currencyCode: string;
  valueDate: Date;
  transactionDate: Date;
  startBalance: number;
  endBalance: number;
}

export class PreSaveTransferMutationDTO {
  amount: number;
  description: string;
  transfer?: PreSaveTransferDTO;
}

export class PreSaveDTO {
  transfer: PreSaveTransferDTO;
  mutation: PreSaveTransferMutationDTO;
}

export class ValidatedHashRawTransferDTO extends ValidatedRawTransfersDTO {
  hashPromises?: Promise<any>[];
  preSavedTransfers?: PreSaveDTO[];
}

/**
 * todo:
 *  return saved and existing hashes
 *  something goes wrong, new hashes are constantly created
 */

@Injectable()
export class TransferImportService {
  constructor(
    private transferRepository: TransferRepositoryService,
    private transferMutationRepository: TransferMutationRepositoryService,
  ) {
  }

  test(file: RawInvoiceJsonDTO[]): Promise<any> {
    return new Promise((resolve) => {
      // Serialize
      const hashExists = [];
      this.serializationValidation(file).then((serializedTransfers) => {
        return serializedTransfers;
      }).then((serializedTransfers) => {
        const preSavedTransferItems: PreSaveDTO[] = [];
        // Check for hash
        return this.getHashPromises(serializedTransfers.validTransfers).then((hasHashResults) => {
          if (hasHashResults.hasHashResponse.length !== serializedTransfers.validTransfers.length) {
            console.log('something went wrong');
          }
          for (let i = 0; i < hasHashResults.hasHashResponse.length; i++) {
            if (hasHashResults.hasHashResponse[i].length === 0) {
              preSavedTransferItems.push(this.buildPreSavedTransfers(serializedTransfers.validTransfers[i], hasHashResults.usedHashes[i]));
            } else {
              hashExists.push(hasHashResults.hasHashResponse[i]);
            }
          }

          return preSavedTransferItems;
        })
      }).then((preSaved) => {
        const savedTransfersPromises: Promise<Transfer>[] = [];
        for (let i = 0; i < preSaved.length; i++) {
          savedTransfersPromises.push(this.transferRepository.save(preSaved[i].transfer as Transfer));
        }
        Promise.all(savedTransfersPromises).then((savedResults) => {
          if (savedResults.length !== preSaved.length) {
            console.log('something went wrong');
          }
          const savedMutations = [];
          for (let i = 0; i < savedResults.length; i++) {
            savedMutations.push(this.transferMutationRepository.save(preSaved[i].mutation as TransferMutation));
          }

          Promise.all(savedMutations).then((savedTransferMutations: TransferMutation[]) => {
            if (savedTransferMutations.length !== preSaved.length || savedTransferMutations.length !== savedResults.length) {
              console.log('something went wrong');
            }
            for (let i = 0; i < savedTransferMutations.length; i++) {
              delete savedTransferMutations[i].transfer;
              savedResults[i].mutations = [savedTransferMutations[i]];
            }

            resolve({
              hashExists: hashExists,
              savedTransfers: savedResults
            });
          })
        });
      });
    });
  }

  getHashPromises(validTransfers: RawTransferSerializerDTO[]): Promise<{hasHashResponse: Transfer[][], usedHashes: string[]}> {
    return new Promise((resolve) => {
      const hashPromises: Promise<Transfer[]>[] = [];
      const usedHashes = [];
      for (let i = 0; i < validTransfers.length; i++) {
        const newHash = hash(validTransfers[i]);
        usedHashes.push(newHash);
        hashPromises.push(this.transferRepository.hashExists(newHash));
      }
      Promise.all(hashPromises).then((hasHashResponse) => {
        resolve({hasHashResponse, usedHashes});
      });
    });
  }

  buildPreSavedTransfers(item: RawTransferSerializerDTO, hash): PreSaveDTO {
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
        transfer: transfer
      },
    };
  }

  serializationValidation(file: RawInvoiceJsonDTO[]): Promise<ValidatedRawTransfersDTO> {
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

  // postMultiExcel(file: RawInvoiceJsonDTO[]): Promise<Transfer[]> {
  //   return new Promise((resolve) => {
  //     this.serializeRawJson(file).then((formattedData) => {
  //       const transferMutationPromises = [];
  //       const transferPromises = [];
  //       for (const datum of formattedData) {
  //         transferPromises.push(this.transferRepository.save(datum.transfer));
  //       }
  //
  //       Promise.all(transferPromises).then((savedTransfers: Transfer[]) => {
  //         if (savedTransfers.length !== formattedData.length) {
  //           throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
  //         }
  //         for (let i = 0; i < formattedData.length; i++) {
  //           formattedData[i].mutation.transfer = savedTransfers[i];
  //           transferMutationPromises.push(this.transferMutationRepository.save(formattedData[i].mutation));
  //         }
  //
  //         Promise.all(transferMutationPromises).then((savedMutations: TransferMutation[]) => {
  //           const savedResponse: Transfer[] = [];
  //           for (const savedMutation of savedMutations) {
  //             const savedTransfer: Transfer = savedMutation.transfer;
  //             savedTransfer.mutations = [{
  //               amount: savedMutation.amount,
  //               startBalance: savedMutation.startBalance,
  //               endBalance: savedMutation.endBalance,
  //               description: savedMutation.description,
  //               comment: null,
  //               id: savedMutation.id,
  //               active: savedMutation.active,
  //               createdAt: savedMutation.createdAt,
  //               updatedAt: savedMutation.updatedAt,
  //               transfer: null,
  //               parent: null,
  //               children: null,
  //             }];
  //             savedResponse.push(savedTransfer);
  //           }
  //           resolve(savedResponse);
  //         });
  //       });
  //     });
  //   });
  // }

  // private serializeRawJson(rawJson: RawInvoiceJsonDTO[]): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     const formattedTransfers = [];
  //     const promises = [];
  //     for (let i = 0; i < rawJson.length; i++) {
  //       const newHash = hash(rawJson[i]);
  //       promises.push(this.transferRepository.hashExists(newHash));
  //     }
  //
  //     Promise.all(promises).then((response) => {
  //       if (response.length !== rawJson.length) {
  //         throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
  //       }
  //       for (let i = 0; i < response.length; i++) {
  //         if (response[i].length === 0) {
  //           formattedTransfers.push({
  //             transfer: this.rawTransferSerialization(rawJson[i]),
  //             mutation: this.rawTransferMutationSerialization(rawJson[i]),
  //           });
  //         }
  //       }
  //       resolve(formattedTransfers);
  //     });
  //   });
  // }

  // private rawTransferSerialization(rawTransfer: RawInvoiceJsonDTO): object {
  //   return {
  //     hash: hash(rawTransfer),
  //     accountNumber: rawTransfer.Rekeningnummer,
  //     currencyCode: rawTransfer.Muntsoort,
  //     transactionDate: new Date().setUTCFullYear(
  //       Number(String(rawTransfer.Transactiedatum).slice(0, 4)),
  //       Number(String(rawTransfer.Transactiedatum).slice(4, 6)),
  //       Number(String(rawTransfer.Transactiedatum).slice(6, 8)),
  //     ),
  //     valueDate: new Date().setUTCFullYear(
  //       Number(String(rawTransfer.Rentedatum).slice(0, 4)),
  //       Number(String(rawTransfer.Rentedatum).slice(4, 6)),
  //       Number(String(rawTransfer.Rentedatum).slice(6, 8)),
  //     ),
  //   };
  // }
  //
  // private rawTransferMutationSerialization(mutation: RawInvoiceJsonDTO): object {
  //   return {
  //     amount: mutation.Transactiebedrag,
  //     startBalance: mutation.Beginsaldo,
  //     endBalance: mutation.Eindsaldo,
  //     description: mutation.Omschrijving,
  //   };
  // }
}
