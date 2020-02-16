import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Description } from '../description.entity';
import { DeepPartial, DeleteResult, Repository, SaveOptions, UpdateResult } from 'typeorm';

@Injectable()
export class DescriptionRepositoryService {
  constructor(
    @InjectRepository(Description) private repository: Repository<Description>,
  ) {
  }

  async getDescriptionById(id: number): Promise<Description[]> {
    return await this.repository.find({
      where: [{ id }],
    });
  }

  async getDescriptionByRuleId(ruleId: number): Promise<Description[]> {
    return await this.repository.find({
      where: [{ ruleId }],
    });
  }

  async createDescription<T extends DeepPartial<Description>>(entity: T, options?: SaveOptions): Promise<Description>
  async createDescription(description: Description) {
    return await this.repository.save(description);
  }

  async patch(id: number, description: Description): Promise<UpdateResult> {
    return await this.repository.update(id, description);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
