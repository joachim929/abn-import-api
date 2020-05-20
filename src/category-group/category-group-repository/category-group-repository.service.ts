import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryGroup } from '../category-group.entity';
import { DeepPartial, DeleteResult, Repository, SaveOptions, UpdateResult } from 'typeorm';

@Injectable()
export class CategoryGroupRepositoryService {
  constructor(
    @InjectRepository(CategoryGroup) private repository: Repository<CategoryGroup>,
  ) {
  }

  async getByIds(ids: string[]): Promise<CategoryGroup[]> {
    return await this.repository.findByIds(ids).catch((reason) => {
      throw new HttpException(reason.message, HttpStatus.NOT_FOUND);
    });
  }

  async getGroupsWithCategories(): Promise<CategoryGroup[]> {
    return await this.repository.find({ relations: ['categories'] });
  }

  async createGroup<T extends DeepPartial<CategoryGroup>>(entity: T, options?: SaveOptions): Promise<CategoryGroup>;
  async createGroup(group: CategoryGroup) {
    return await this.repository.save(group);
  }

  async updateGroup(id: string, group: CategoryGroup): Promise<UpdateResult> {
    return await this.repository.update(id, group).catch((reason) => {
      throw new HttpException(reason.message, HttpStatus.BAD_REQUEST);
    });
  }

  async deleteGroup(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id).catch((reason) => {
      throw new HttpException(reason.message, HttpStatus.NOT_FOUND);
    });
  }
}
