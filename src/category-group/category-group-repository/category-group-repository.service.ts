import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryGroup } from '../category-group.entity';
import { DeepPartial, DeleteResult, In, Repository, SaveOptions, UpdateResult } from 'typeorm';
import { CategoryGroupDTO } from '../dtos/category-group.dto';

@Injectable()
export class CategoryGroupRepositoryService {
  constructor(
    @InjectRepository(CategoryGroup) private repository: Repository<CategoryGroup>,
  ) {
  }

  async getGroups(): Promise<CategoryGroup[]> {
    return await this.repository.find();
  }

  async getByIds(ids: string[]): Promise<CategoryGroup[]> {
    return await this.repository.find({
      where: ids.map(id => ({ id })),
    });
  }

  async getGroupById(id: string): Promise<CategoryGroup> {
    return await this.repository.findOneOrFail(id);
  }

  async getGroupsWithCategories(): Promise<CategoryGroup[]> {
    return await this.repository.find({ relations: ['categories'] });
  }

  async createGroup<T extends DeepPartial<CategoryGroup>>(entity: T, options?: SaveOptions): Promise<CategoryGroup>;
  async createGroup(group: CategoryGroup) {
    return await this.repository.save(group);
  }

  async updateGroup(id: string, group: CategoryGroup): Promise<UpdateResult> {
    return await this.repository.update(id, group);
  }

  async deleteGroup(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
