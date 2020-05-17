import { Injectable } from '@nestjs/common';
import { CategoryRepositoryService } from './category-repository/category-repository.service';
import { Category } from './category.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CategoryDTO } from './dtos/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private repositoryService: CategoryRepositoryService,
  ) {
  }

  getCategory(id: number): Promise<CategoryDTO> {
    return new Promise((resolve, reject) => {
      this.repositoryService.getCategoryById(id).then((response: Category) => {
        resolve(new CategoryDTO(response));
      }).catch(reason => reject(reason));
    });
  }

  getAll(): Promise<CategoryDTO[]> {
    return new Promise((resolve, reject) => {
      this.repositoryService.getCategories().then((response: Category[]) => {
        if (response.length > 0) {
          resolve(response.map(category => new CategoryDTO(category)));
        } else {
          reject(`Found no categories`);
        }
      }).catch(reason => reject(reason));
    });
  }

  patchCategory(category: Category) {
    return new Promise((resolve, reject) => {
      this.repositoryService.updateCategory(category.id, category).then((response: UpdateResult) => {
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  deleteCategory(id: number) {
    return new Promise((resolve, reject) => {
      this.repositoryService.deleteCategory(id).then((response: DeleteResult) => {
        if (response.raw.length === 0) {
          resolve();
        } else {
          reject(response.raw);
        }
      }).catch(reason => reject(reason));
    });
  }

  createCategory(category: CategoryDTO): Promise<CategoryDTO> {
    return new Promise((resolve, reject) => {
      this.repositoryService.createCategory(category).then((response: Category) => {
        resolve(new CategoryDTO(response));
      }).catch(reason => reject(reason));
    });
  }
}
