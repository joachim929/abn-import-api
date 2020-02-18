import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from '../invoice.entity';
import { DeepPartial, DeleteResult, Repository, SaveOptions, UpdateResult } from 'typeorm';

@Injectable()
export class InvoiceRepositoryService {
  constructor(
    @InjectRepository(Invoice) private repository: Repository<Invoice>
  ) {
  }

  async getInvoices(userId: number): Promise<Invoice[]> {
    return await this.repository.find({
      where: [{userId}]
    });
  }

  async createInvoice<T extends DeepPartial<Invoice>>(entity: T, options?: SaveOptions): Promise<Invoice>
  async createInvoice(invoice: Invoice) {
    console.log(invoice);
    return await this.repository.save(invoice);
  }

  async updateInvoice(id: number, invoice: Invoice): Promise<UpdateResult> {
    return await this.repository.update(id, invoice);
  }

  async deleteInvoice(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
