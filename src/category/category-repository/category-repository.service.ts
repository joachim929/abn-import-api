import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../category.entity';
import { DeepPartial, DeleteResult, Repository, SaveOptions, UpdateResult } from 'typeorm';

@Injectable()
export class CategoryRepositoryService {
  constructor(
    @InjectRepository(Category) private repository: Repository<Category>,
  ) {
  }

  async getCategories(): Promise<Category[]> {
    return await this.repository.find({});
  }

  async getCategoryById(id: number): Promise<Category> {
    return await this.repository.findOneOrFail({
      where: { id },
    });
  }

  async getCategoriesByIds(ids: number[]): Promise<Category[]> {
    return await this.repository.findByIds(ids).catch((reason) => {
      throw new HttpException(reason.message, HttpStatus.NOT_FOUND);
    });
  }

  async createCategory<T extends DeepPartial<Category>>(entity: T, options?: SaveOptions): Promise<Category>
  async createCategory(group: Category) {
    return await this.repository.save(group);
  }

  async updateCategory(id: number, group: Category): Promise<UpdateResult> {
    return await this.repository.update(id, group);
  }

  async deleteCategory(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
