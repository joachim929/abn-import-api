import { Injectable } from '@nestjs/common';
import { InvoiceRepositoryService } from './invoice-repository/invoice-repository.service';
import { Invoice } from './invoice.entity';
import { response } from 'express';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class InvoiceService {
  constructor(private repositoryService: InvoiceRepositoryService) {
  }

  getInvoices(userId: number): Promise<Invoice[]> {
    return new Promise((resolve, reject) => {
      console.log(userId);
      this.repositoryService.getInvoices(userId).then((response: Invoice[]) => {
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  createInvoice(invoice: Invoice): Promise<Invoice> {
    return new Promise((resolve, reject) => {
      this.repositoryService.createInvoice(invoice).then((response: Invoice) => {
        resolve(response);
      }).catch(reason => reject(reason));
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
