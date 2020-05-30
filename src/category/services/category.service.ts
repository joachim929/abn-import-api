import { Injectable } from '@nestjs/common';
import { CategoryRepositoryService } from '../repositories/category-repository/category-repository.service';
import { Category } from '../category.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CategoryDTO, CreateCategoryDTO } from '../dtos/category.dto';
import { CategoryGroupRepositoryService } from '../repositories/category-group-repository/category-group-repository.service';

@Injectable()
export class CategoryService {
  constructor(
    private repositoryService: CategoryRepositoryService,
    private categoryGroupRepositoryService: CategoryGroupRepositoryService
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

  patchCategory(category: CategoryDTO) {
    return new Promise((resolve, reject) => {
      const validatedCategory = new CategoryDTO((category as unknown) as Category);
      this.repositoryService.getCategoryById(category.id).then((ocCategory) => {
        ocCategory = {...ocCategory, description: validatedCategory.description, name: validatedCategory.name, order: validatedCategory.order};
        this.repositoryService.updateCategory(ocCategory.id, ocCategory).then((response: UpdateResult) => {
          resolve(new CategoryDTO(ocCategory));
        }).catch(reason => reject(reason));
      });
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

  // todo: Get parent first, then set parent
  createCategory(category: CreateCategoryDTO, parentId: string): Promise<CategoryDTO> {
    return new Promise((resolve, reject) => {
      category = new CreateCategoryDTO(category);
      this.categoryGroupRepositoryService.findOneById(parentId).then((parent) => {
        this.repositoryService.createCategory({...category, categoryGroup: parent}).then((response: Category) => {
          resolve(new CategoryDTO(response));
        }).catch(reject);
      }).catch(reject);
    });
  }
}
