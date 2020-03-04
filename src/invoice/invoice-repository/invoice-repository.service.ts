import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from '../invoice.entity';
import {
  Between,
  DeepPartial,
  DeleteResult,
  LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual,
  QueryBuilder,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { InvoiceDTO } from '../dtos/invoice.dto';
import { InvoiceFilteredDTO } from '../dtos/invoice-filtered.dto';

@Injectable()
export class InvoiceRepositoryService {
  constructor(
    @InjectRepository(Invoice) private repository: Repository<Invoice>,
  ) {
  }

  async getMaxAmount() {
    const query = this.repository
      .createQueryBuilder('invoice');
    query.select('MIN(invoice.amount)', 'min');
    return query.getRawOne();
  }

  async getMinAmount() {
    const query = this.repository.createQueryBuilder('invoice');
    query.select('MAX(invoice.amount)', 'max');
    return query.getRawOne();
  }

  async getFilteredInvoices(filters: InvoiceFilteredDTO) {
    const query: any = {};
    if (filters.startDate && filters.endDate) {
      query.transactionDate = Between(filters.startDate, filters.endDate);
    } else if (filters.startDate) {
      query.transactionDate = MoreThanOrEqual(filters.startDate);
    } else if (filters.endDate) {
      query.transactionDate = LessThanOrEqual(filters.endDate);
    }

    query.skip = filters.skip || null;

    return this.repository.findAndCount(
      query,
    );
  }

  async getInvoices(userId: number): Promise<Invoice[]> {
    return await this.repository.find({
      where: [{ userId }],
    });
  }

  async getInvoice(id: number): Promise<Invoice> {
    return await this.repository.findOne({
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
