import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SaveOptions, UpdateResult } from 'typeorm';
import { TransferMutation } from '../entities/transfer-mutation.entity';
import { TransferListParams } from '../dtos/transfer-list-params.dto';

@Injectable()
export class TransferMutationRepositoryService {
  constructor(
    @InjectRepository(TransferMutation) private repository: Repository<TransferMutation>,
  ) {
  }

  async getOne(id: number, active = true, children = true, transfer = true): Promise<TransferMutation> {
    const relations = ['parent', 'category'];
    if (children === true) {
      relations.push('children');
    }
    if (transfer === true) {
      relations.push('transfer');
    }

    let where: any = { id };
    if (active === true) {
      where = { ...where, active: active };
    }
    return await this.repository.findOneOrFail({
      where: where,
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

  async save<T extends DeepPartial<TransferMutation>>(entity: T, options?: SaveOptions): Promise<TransferMutation>
  async save(mutation: TransferMutation): Promise<TransferMutation> {
    return await this.repository.save(mutation)
      .catch(reason => {
        throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  async getByCategoryId(listParams: TransferListParams): Promise<[TransferMutation[], number] | void> {
    const options: any = {
      where: {
        category: { id: listParams.categoryId ? listParams.categoryId : null },
        active: true,
      },
      relations: ['transfer', 'category'],
    };

    return await this.repository.findAndCount(options).catch((reason) => {
      throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }
}
