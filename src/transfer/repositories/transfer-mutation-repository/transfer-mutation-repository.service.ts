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

  async get() {
    return await this.repository.find({relations: ['transfer']});
  }

  async save(mutation) {
    return await this.repository.save(mutation);
  }
}
