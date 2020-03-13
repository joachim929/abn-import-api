import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Transfer } from '../../entities/transfer.entity';

@Injectable()
export class TransferRepositoryService {
  constructor(
    @InjectRepository(Transfer) private repository: Repository<Transfer>,
  ) {
  }

  async save(transfer: Transfer): Promise<Transfer> {
    return await this.repository.save(transfer);
  }

  /**
   * Needed for admin maybe?
   */
  async findOneWithMutations(id: string, active?: boolean): Promise<Transfer> {
    return await this.repository.findOneOrFail({
      where: [active ? { id, active, mutations: { active } } : { id }],
      relations: ['mutations'],
    }).catch(() => {
      throw new HttpException(`No transfer found with id: ${id}`, HttpStatus.BAD_REQUEST);
    });
  }

  async findOne(id: string): Promise<Transfer> {
    return await this.repository.findOneOrFail({
      where: [{ id }],
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

  async updateTransfer(transfer: Transfer): Promise<UpdateResult> {
    return await this.repository.update(transfer.id, transfer).catch((reason) => {
      throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  async getTransfersWithMutations(id?: string): Promise<Transfer[]> {
    const query: any = {
      relations: ['mutations'],
    };
    if (id) {
      query.where = [{ id, mutations: { active: true } }];
    } else {
      query.where = [{ mutations: { active: true } }];
    }

    return await this.repository.find(query);
  }

  async hashExists(hash: string): Promise<Transfer[]> {
    return await this.repository.find({
      where: [{ hash }],
    });
  }
}
