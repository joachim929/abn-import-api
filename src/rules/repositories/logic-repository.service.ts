import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Logic } from '../entities/logic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, Repository, SaveOptions } from 'typeorm';


// https://typeorm.io/#/repository-api
@Injectable()
export class LogicRepositoryService {
  constructor(@InjectRepository(Logic) private repository: Repository<Logic>) {
  }

  async getLogicById(id: string): Promise<Logic> {
    return await this.repository.findOneOrFail({
      where: { id },
    }).catch(() => {
      throw new HttpException(`No LogicEntity found with ${id}`, HttpStatus.NOT_FOUND);
    });
  }

  async getAll(): Promise<Logic[]> {
    return await this.repository.find({
      relations: ['andCondition', 'orCondition']
    })
  }

  async getLogicByIds(ids: string[]): Promise<Logic[]> {
    return await this.repository.findByIds(ids);
  }

  async postLogic<T extends DeepPartial<Logic>>(entity: T, options?: SaveOptions): Promise<Logic>
  async postLogic(logic): Promise<Logic> {
    return await this.repository.save(logic);
  }

  async postMultipleLogic<T extends DeepPartial<Logic[]>>(entity: T, options?: SaveOptions): Promise<Logic[]>
  async postMultipleLogic(logic: any[]): Promise<Logic[]> {
    return await this.repository.save(logic);
  }

  async patchLogic(id: string, updateLogic): Promise<Logic> {
    return new Promise((resolve, reject) => {
      this.repository.findOne({ where: { id } }).then((response) => {
        return this.repository.save({
          ...response,
          ...updateLogic,
        });
      }).then((updatedLogic) => {
        resolve(updatedLogic)
      }).catch(reject);
    });
  }

  async deleteLogic(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
