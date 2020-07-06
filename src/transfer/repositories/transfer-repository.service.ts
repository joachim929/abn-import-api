import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SaveOptions } from 'typeorm';
import { Transfer } from '../entities/transfer.entity';
import { TransferListParams } from '../dtos/transfer-list-params.dto';

@Injectable()
export class TransferRepositoryService {
  constructor(
    @InjectRepository(Transfer) private repository: Repository<Transfer>,
  ) {
  }


  async save<T extends DeepPartial<Transfer>>(entity: T, options?: SaveOptions): Promise<Transfer>
  async save(transfer: Transfer): Promise<Transfer> {
    return await this.repository.save(transfer);
  }

  async findTransferWithAllRelationships(id: string) {
    const query = this.repository.createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.mutations', 'mutations')
      .leftJoinAndSelect('mutations.children', 'children')
      .leftJoinAndSelect('mutations.parent', 'parent')
      .leftJoinAndSelect('mutations.category', 'category')
      .where('transfer.id = :id', { id })
      .orderBy('mutations.createdAt', 'DESC');

    return await query.getOne();
  }

  async findOneWithMutations(id: string, active?: boolean): Promise<Transfer> {
    return await this.repository.findOneOrFail({
      where: [active ? { id, active, mutations: { active } } : { id }],
      relations: ['mutations'],
    }).catch(() => {
      throw new HttpException(`No transfer found with id: ${id}`, HttpStatus.BAD_REQUEST);
    });
  }

  /**
   * Needed for admin maybe?
   */
  async getTransfers(id?: string) {
    return await this.repository.find({
      where: id ? [{ id }] : null,
      relations: ['mutations'],
    }).catch((reason) => {
      if (id) {
        throw new HttpException(`No transfers found with id: ${id}`, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  }

  async getFilteredTransfersWithMutations(filters: TransferListParams): Promise<[Transfer[], number]> {

    const query = this.repository.createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.mutations', 'mutations')
      .leftJoinAndSelect('mutations.category', 'category')
      .where('transfer.active = :active', { active: filters.active ? filters.active : true })
      .andWhere('mutations.active = :active', { active: filters.active ? filters.active : true });

    if (filters.orderBy && filters.orderDirection) {
      query.orderBy(filters.orderBy, filters.orderDirection);
    } else {
      query.orderBy('transfer.transactionDate', 'ASC');
    }

    if (typeof filters.minAmount === 'number') {
      query.andWhere('mutations.amount >= :minAmount', { minAmount: filters.minAmount });
    }

    if (typeof filters.maxAmount === 'number') {
      query.andWhere('mutations.amount <= :maxAmount', { maxAmount: filters.maxAmount });
    }

    if (typeof filters.categoryId === 'number') {
      query.andWhere('category.id = :categoryId', { categoryId: filters.categoryId });
    }

    query.skip(filters.skip);

    return await query.getManyAndCount();
  }

  async hashExists(hash: string): Promise<Transfer[]> {
    return await this.repository.find({
      where: [{ hash }],
    });
  }
}
