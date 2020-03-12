import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferMutation } from '../../entities/transfer-mutation.entity';

@Injectable()
export class TransferMutationRepositoryService {
  constructor(
    @InjectRepository(TransferMutation) private repository: Repository<TransferMutation>,
  ) {
  }

  async getOne(id: number): Promise<TransferMutation> {
    return await this.repository.findOneOrFail({
      where: [{ id }],
      relations: ['children', 'parent'],
    });
  }

  async getMutations(id?: number): Promise<TransferMutation[]> {
    return await this.repository.find(id ? { where: [{ id }, { active: true }] } : null);
  }

  async save(mutation: TransferMutation): Promise<TransferMutation> {
    return await this.repository.save(mutation);
  }
}
