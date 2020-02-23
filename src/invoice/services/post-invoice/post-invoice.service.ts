import { Injectable } from '@nestjs/common';
import { RawInvoiceJsonDTO } from '../../dtos/raw-invoice-json.dto';
import { CreateInvoiceDTO } from '../../dtos/create-invoice.dto';

@Injectable()
export class PostInvoiceService {
  serializeRawJson(rawJson: RawInvoiceJsonDTO[]): CreateInvoiceDTO[] {
    const formattedInvoices = [];
    for (const invoice of rawJson) {

      const transactionDate = invoice.Transactiedatum.toString();
      const valueDate = invoice.Rentedatum.toString();

      formattedInvoices.push({
        accountNumber: invoice.Rekeningnummer,
        amount: invoice.Transactiebedrag,
        description: invoice.Omschrijving,
        endBalance: invoice.Eindsaldo,
        mutationCode: invoice.Muntsoort,
        startBalance: invoice.Beginsaldo,
        transactionDate: new Date().setUTCFullYear(
          Number(transactionDate.slice(0, 4)),
          Number(transactionDate.slice(4, 6)),
          Number(transactionDate.slice(6, 8)),
        ),
        valueDate: new Date().setUTCFullYear(
          Number(valueDate.slice(0, 4)),
          Number(valueDate.slice(4, 6)),
          Number(valueDate.slice(6, 8)),
        ),
        userId: 1
      });
    }

    return formattedInvoices;
  }
}
