import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from '../invoice.entity';
import { DeepPartial, DeleteResult, Repository, SaveOptions, UpdateResult } from 'typeorm';
import { InvoiceDTO } from '../dtos/invoice.dto';

@Injectable()
export class InvoiceRepositoryService {
  constructor(
    @InjectRepository(Invoice) private repository: Repository<Invoice>,
  ) {
  }

  async getInvoices(userId: number): Promise<Invoice[]> {
    return await this.repository.find({
      where: [{ userId }],
    });
  }

  async getInvoice(id: number): Promise<Invoice[]> {
    return await this.repository.find({
      where: [{ id }],
    });
  }

  async createInvoice<T extends DeepPartial<Invoice>>(entity: T, options?: SaveOptions): Promise<Invoice>
  async createInvoice(invoice: Invoice) {
    return await this.repository.save(invoice);
  }

  async updateInvoice(id: number, invoice: InvoiceDTO): Promise<UpdateResult> {
    return await this.repository.update(id, invoice);
  }

  async deleteInvoice(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
