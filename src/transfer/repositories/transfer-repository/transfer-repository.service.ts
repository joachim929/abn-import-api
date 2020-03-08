import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from '../../entities/transfer.entity';

@Injectable()
export class TransferRepositoryService {
  constructor(
    @InjectRepository(Transfer) private repository: Repository<Transfer>
  ) {
  }

  async save(transfer): Promise<Transfer> {
    return await this.repository.save(transfer);
  }

  async get() {
    return await this.repository.find({relations: ['mutations']});
  }
}
