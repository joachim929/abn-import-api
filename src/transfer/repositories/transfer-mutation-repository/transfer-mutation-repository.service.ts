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

  async getMutations(id?: number) {
    return await this.repository.find(id ? { where: [{ id }] } : null);
  }

  async save(mutation) {
    return await this.repository.save(mutation);
  }
}
