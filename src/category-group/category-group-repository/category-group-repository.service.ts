import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryGroup } from '../category-group.entity';
import { DeepPartial, DeleteResult, Repository, SaveOptions, UpdateResult } from 'typeorm';

@Injectable()
export class CategoryGroupRepositoryService {
  constructor(
    @InjectRepository(CategoryGroup) private repository: Repository<CategoryGroup>,
  ) {
  }

  async getGroups(): Promise<CategoryGroup[]> {
    console.log('all, repo');
    return await this.repository.find({});
  }

  async getGroupsById(id: number): Promise<CategoryGroup[]> {
    return await this.repository.find({
      where: [{ id }],
    });
  }

  async getGroupsWithCategories(): Promise<CategoryGroup[]> {
    return await this.repository.find({ relations: ['categories']});
  }

  async createGroup<T extends DeepPartial<CategoryGroup>>(entity: T, options?: SaveOptions): Promise<CategoryGroup>;
  async createGroup(group: CategoryGroup) {
    return await this.repository.save(group);
  }

  async updateGroup(id: number, group: CategoryGroup): Promise<UpdateResult> {
    return await this.repository.update(id, group);
  }

  async deleteGroup(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
