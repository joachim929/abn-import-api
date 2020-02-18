import { Injectable } from '@nestjs/common';
import { InvoiceRepositoryService } from './invoice-repository/invoice-repository.service';
import { Invoice } from './invoice.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { InvoiceDTO } from './dtos/invoice.dto';
import { CreateInvoiceDTO } from './dtos/create-invoice.dto';

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

  // todo: fix strong typing
  createInvoice(invoice: any): Promise<InvoiceDTO> {
    return new Promise((resolve, reject) => {
      this.repositoryService.createInvoice(invoice).then((response: Invoice) => {
        resolve(new InvoiceDTO(response));
      }).catch(reason => reject(reason));
    });
  }

  // todo: fix strong typing
  createInvoices(invoices: any[]): Promise<InvoiceDTO[]> {
    return new Promise((resolve, reject) => {
      const promises = [];
      for (const invoice of invoices) {
        promises.push(this.createInvoice(invoice));
      }
      Promise.all(promises).then(createdInvoices => {
        resolve(createdInvoices);
      })
    });
  }

  patchInvoice(invoice: Invoice): Promise<UpdateResult> {
    return new Promise((resolve, reject) => {
      this.repositoryService.updateInvoice(invoice.id, invoice).then((response: UpdateResult) => {
        resolve(response);
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
}
