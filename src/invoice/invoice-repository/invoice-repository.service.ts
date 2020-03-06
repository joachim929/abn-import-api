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
import * as moment from 'moment';

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
    const query: any = {
      where: {},
    };
    if (filters.startDate && filters.endDate) {
      query.where.transactionDate = Between(
        moment(filters.startDate).format('YYYY-MM-DD HH:MM:SS'),
        moment(filters.endDate).format('YYYY-MM-DD HH:MM:SS')
      );
    } else if (filters.startDate) {

      query.where.transactionDate = MoreThanOrEqual(
        moment(filters.startDate).format('YYYY-MM-DD HH:MM:SS'));
    } else if (filters.endDate) {

      query.where.transactionDate = LessThanOrEqual(
        moment(filters.endDate).format('YYYY-MM-DD HH:MM:SS')
      );
    }

    if (filters.minAmount && filters.maxAmount) {
      query.where.amount = Between(filters.minAmount, filters.maxAmount);
    } else if (filters.minAmount) {
      query.where.amount = MoreThan(filters.minAmount);
    } else if (filters.maxAmount) {
      query.where.amount = LessThan(filters.maxAmount);
    }

    if (filters.limit) {
      query.take = filters.limit;
    }

    query.skip = filters.skip || 0;

    return this.repository.findAndCount(
      query
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
