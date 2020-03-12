import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { TransferMutation } from '../../entities/transfer-mutation.entity';

@Injectable()
export class TransferMutationRepositoryService {
  constructor(
    @InjectRepository(TransferMutation) private repository: Repository<TransferMutation>,
  ) {
  }

  async getOne(id: number, active = true): Promise<TransferMutation> {
    return await this.repository.findOneOrFail({
      where: [{ id, active }],
      relations: ['children', 'parent', 'transfer'],
    }).catch(() => {
      throw new HttpException(`Mutation where { id:${id}, active:${active} } not found`, HttpStatus.BAD_REQUEST);
    });
  }

  async updateMutation(mutation: TransferMutation): Promise<UpdateResult> {
    return await this.repository.update(mutation.id, mutation).catch((reason) => {
      throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  async getMutations(id?: number): Promise<TransferMutation[]> {
    return await this.repository.find(id ? { where: [{ id }, { active: true }] } : null).catch((reason) => {
      throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  async save(mutation: TransferMutation): Promise<TransferMutation> {
    return await this.repository.save(mutation).catch((reason) => {
      throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}
