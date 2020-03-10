import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async getTransfers(id?: string): Promise<Transfer[]> {
    return await this.repository.find(id ? { where: [{ id }] } : null);
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
