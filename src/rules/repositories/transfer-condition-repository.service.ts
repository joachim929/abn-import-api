import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransferCondition } from '../entities/transfer-condition.entity';
import { DeepPartial, DeleteResult, Repository, SaveOptions } from 'typeorm';

@Injectable()
export class TransferConditionRepositoryService {
  relationships = [
    'category',
    'orLogic',
    'andLogic',
  ];
  constructor(@InjectRepository(TransferCondition) private repository: Repository<TransferCondition>) {

  }

  async getById(id: string, relationships?: string[]): Promise<TransferCondition> {

    let options = {};
    options = {...options, id: id};
    if (relationships) {
      options = {...options, relations: relationships}
    }
    return await this.repository.findOneOrFail(options).catch(() => {
      throw new HttpException(`No TransferCondition found with ${id}`, HttpStatus.NOT_FOUND);
    })
  }

  async getAll(): Promise<TransferCondition[]> {
    return await this.repository.find({
      relations: this.relationships
    });
  }

  async getByIds(ids: string[]): Promise<TransferCondition[]> {
    return await this.repository.findByIds(ids);
  }

  async post<T extends DeepPartial<TransferCondition>>(entity: T, options?:SaveOptions): Promise<TransferCondition>
  async post(transferCondition): Promise<TransferCondition> {
    return await this.repository.save(transferCondition);
  }

  async patch(id: string, updateCondition): Promise<TransferCondition> {
    return new Promise((resolve, reject) => {
      this.repository.findOneOrFail(id).then((response) => {
        return this.repository.save({
          ...response,
          ...updateCondition
        });
      }).then((updatedCondition) => {
        resolve(updatedCondition);
      }).catch(reject);
    });
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
