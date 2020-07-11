import { IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  @IsNumber()
  startBalance: number;
  @ApiProperty()
  @IsNumber()
  endBalance: number;
  @ApiProperty()
  @IsString()
  currencyCode: string;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsNumber()
  accountNumber: number;
  @ApiProperty()
  @IsDate()
  valueDate: Date;
  @ApiProperty()
  @IsNumber()
  amount: number;
  @ApiProperty()
  @IsDate()
  transactionDate: Date;

  constructor(rawTransfer) {
    this.startBalance = rawTransfer.Beginsaldo;
    this.endBalance = rawTransfer.Eindsaldo;
    this.currencyCode = rawTransfer.Muntsoort;
    this.description = rawTransfer.Omschrijving;
    this.accountNumber = rawTransfer.Rekeningnummer;
    this.valueDate = new Date(
      Number(String(rawTransfer.Rentedatum).slice(0, 4)),
      Number(String(rawTransfer.Rentedatum).slice(4, 6)) - 1,
      Number(String(rawTransfer.Rentedatum).slice(6, 8)),
    );
    this.amount = rawTransfer.Transactiebedrag;
    this.transactionDate = new Date(
      Number(String(rawTransfer.Transactiedatum).slice(0, 4)),
      Number(String(rawTransfer.Transactiedatum).slice(4, 6)) - 1,
      Number(String(rawTransfer.Transactiedatum).slice(6, 8)),
    );
  }
}
