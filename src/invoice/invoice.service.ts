import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InvoiceRepositoryService } from './invoice-repository/invoice-repository.service';
import { Invoice } from './invoice.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { InvoiceDTO } from './dtos/invoice.dto';
import { CreateInvoiceDTO } from './dtos/create-invoice.dto';
import { SplitInvoiceDTO } from './dtos/split-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private repositoryService: InvoiceRepositoryService) {
  }

  getInvoices(userId: number): Promise<InvoiceDTO[]> {
    return new Promise((resolve, reject) => {
      this.repositoryService.getInvoices(userId).then((response: Invoice[]) => {
        resolve(response.map(invoice => new InvoiceDTO(invoice)));
      }).catch(reason => reject(reason));
    });
  }

  createInvoice(invoice: CreateInvoiceDTO): Promise<InvoiceDTO> {
    return new Promise((resolve, reject) => {
      this.repositoryService.createInvoice(invoice).then((response: Invoice) => {
        resolve(new InvoiceDTO(response));
      }).catch(reason => reject(reason));
    });
  }

  createInvoices(invoices: CreateInvoiceDTO[]): Promise<InvoiceDTO[]> {
    return new Promise((resolve, reject) => {
      const promises = [];
      for (const invoice of invoices) {
        promises.push(this.createInvoice(invoice));
      }
      Promise.all(promises).then(createdInvoices => {
        resolve(createdInvoices);
      });
    });
  }

  patchInvoice(request): Promise<InvoiceDTO> {
    return new Promise((resolve, reject) => {
      this.repositoryService.updateInvoice(request.patch.id, request.patch).then(() => {
        resolve(request.patch);
      }).catch(reason => reject(reason));
    });
  }

  deleteInvoice(id: number): Promise<DeleteResult> {
    return new Promise((resolve, reject) => {
      this.repositoryService.deleteInvoice(id).then((response) => {
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  // todo: Find out if there are any differences between 'excel' and 'text' or
  //    if its the same once converted to JSON
  importInvoices(type: 'excel' | 'text', file: CreateInvoiceDTO[]): Promise<InvoiceDTO[]> {
    return new Promise((resolve, reject) => {
      const parsdedData = file;
      const promises = [];
      for (const invoice of parsdedData) {
        promises.push(this.createInvoice(invoice));
      }
      Promise.all(promises)
        .then((response: InvoiceDTO[]) => resolve(response))
        .catch(reason => reject(reason));
    });
  }
}
