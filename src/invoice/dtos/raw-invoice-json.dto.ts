import { IsDate, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RawInvoiceJsonDTO {
  Beginsaldo: number;
  Eindsaldo: number;
  Muntsoort: string;
  Omschrijving: string;
  Rekeningnummer: number;
  Rentedatum: number;
  Transactiebedrag: number;
  Transactiedatum: number;
}

export class RawTransferSerializerDTO {
  @IsNumber()
  startBalance: number;
  @IsNumber()
  endBalance: number;
  @IsString()
  currencyCode: string;
  @IsString()
  description: string;
  @IsNumber()
  accountNumber: number;
  @IsDate()
  valueDate: Date;
  @IsNumber()
  amount: number;
  @IsDate()
  transactionDate: Date;

  constructor(rawTransfer) {
    this.startBalance = rawTransfer.Beginsaldo;
    this.endBalance = rawTransfer.Eindsaldo;
    this.currencyCode = rawTransfer.Muntsoort;
    this.description = rawTransfer.Omschrijving;
    this.accountNumber = rawTransfer.Rekeningnummer;
    const tempValueDate = new Date();
    tempValueDate.setUTCFullYear(
        Number(String(rawTransfer.Rentedatum).slice(0, 4)),
        Number(String(rawTransfer.Rentedatum).slice(4, 6)),
        Number(String(rawTransfer.Rentedatum).slice(6, 8)),
    );
    this.valueDate = tempValueDate;
    this.amount = rawTransfer.Transactiebedrag;

    const tempTransactionDate = new Date();
    tempTransactionDate.setUTCFullYear(
      Number(String(rawTransfer.Transactiedatum).slice(0, 4)),
      Number(String(rawTransfer.Transactiedatum).slice(4, 6)),
      Number(String(rawTransfer.Transactiedatum).slice(6, 8)),
    );
    this.transactionDate = tempTransactionDate;
  }
}
