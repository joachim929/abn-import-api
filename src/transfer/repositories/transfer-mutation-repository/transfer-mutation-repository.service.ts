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

  async getOnePlain(id: number, active = true): Promise<TransferMutation> {
    return await this.repository.findOneOrFail({
      where: { id, active }
    }).catch(reason => {
      throw new HttpException(reason, HttpStatus.BAD_REQUEST);
    });
  }

  async getOne(id: number, active = true, children = true): Promise<TransferMutation> {
    const relations = ['parent', 'transfer'];
    if (children) {
      relations.push('children');
    }
    return await this.repository.findOneOrFail({
      where: { id, active },
      relations: relations,
    }).catch(reason => {
      throw new HttpException(reason, HttpStatus.BAD_REQUEST);
    });
  }

  async updateMutation(mutation: TransferMutation): Promise<UpdateResult> {
    return await this.repository.update(mutation.id, mutation).catch((reason) => {
      throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  async getMaxAmount() {
    const query = this.repository.createQueryBuilder('transferMutation');
    query.select('MAX(transferMutation.amount)', 'max');
    query.where('transferMutation.active = :active', { active: true });
    return await query.getRawOne();
  }

  async getMinAmount() {
    const query = this.repository.createQueryBuilder('transferMutation');
    query.select('MIN(transferMutation.amount)', 'min');
    query.where('transferMutation.active = :active', { active: true });
    return await query.getRawOne();
  }

  async getMutations(id?: number): Promise<TransferMutation[]> {
    return await this.repository.find(id ? { where: { id, active: true } } : null)
      .catch(reason => {
        throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  async save(mutation: TransferMutation): Promise<TransferMutation> {
    return await this.repository.save(mutation)
      .catch(reason => {
        throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
}
