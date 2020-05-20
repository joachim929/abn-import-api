import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryGroup } from './category-group.entity';
import { CategoryGroupRepositoryService } from './category-group-repository/category-group-repository.service';
import { CategoryGroupDTO } from './dtos/category-group.dto';
import { CategoryDTO } from '../category/dtos/category.dto';
import { CategoryService } from '../category/category.service';
import { CategoryRepositoryService } from '../category/category-repository/category-repository.service';
import { Category } from '../category/category.entity';

@Injectable()
export class CategoryGroupService {
  constructor(
    private categoryGroupRepositoryService: CategoryGroupRepositoryService,
    private categoryRepositoryService: CategoryRepositoryService,
    private categoryService: CategoryService,
  ) {
  }

  getAllWithCategories() {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getGroupsWithCategories()
        .then((response) => resolve(response))
        .catch(reject);
    });
  }

  patchCategoryGroups(categoryGroups: CategoryGroupDTO[]): Promise<CategoryGroupDTO[]> {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getByIds(categoryGroups.map(group => group.id))
        .then((ocCategoryGroups) => {
          Promise.all(categoryGroups.map((categoryGroup) => {
            const ocGroup = ocCategoryGroups.find((ocGroup) => categoryGroup.id === ocGroup.id);
            return this.updateCategoryGroup(categoryGroup, ocGroup);
          }))
            .then(resolve)
            .catch(reject);
        }).catch(reject);
    });
  }

  deleteCategoryGroup(id: string) {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.deleteGroup(id).then((response) => {
        resolve(response);
      }).catch(reject);
    });
  }

  createCategoryGroup(categoryGroup: CategoryGroupDTO): Promise<CategoryGroupDTO> {
    return new Promise((resolve, reject) => {
      let newCategoryGroup: CategoryGroupDTO;
      this.categoryGroupRepositoryService.createGroup(categoryGroup).then((response: CategoryGroup) => {
        newCategoryGroup = { ...response, categories: [] };

        if (categoryGroup.categories.length > 0) {
          const promises = [];
          categoryGroup.categories.map((category: CategoryDTO) => {
            const newCategory = { ...category, categoryGroup: response };
            promises.push(this.categoryService.createCategory(newCategory));
          });
          Promise.all(promises).then((response) => {
            response.map(item => newCategoryGroup.categories.push(item));
          });
        }
        resolve(new CategoryGroupDTO(response));
      }).catch(reject);
    });
  }

  private updateCategoryGroup(inputGroup: CategoryGroupDTO, ocGroup: CategoryGroup): Promise<CategoryGroupDTO> {
    return new Promise((resolve, reject) => {
      this.checkForValue(ocGroup, `Category group "${inputGroup.name}" not found`, HttpStatus.NOT_FOUND);
      this.checkForValue(inputGroup, 'Invalid patch params', HttpStatus.BAD_REQUEST);

      ocGroup = { ...ocGroup, name: inputGroup.name, description: inputGroup.description };

      this.categoryGroupRepositoryService.updateGroup(ocGroup.id, ocGroup)
        .then(() =>
          this.categoryRepositoryService.getCategoriesByIds(inputGroup.categories.map(category => category.id)))
        .then((ocCategories: Category[]) =>
          Promise.all(inputGroup.categories.map(category =>
            this.updateCategory(category, ocGroup, ocCategories.find(ocCategory => ocCategory.id === category.id)))))
        .then((categories) => resolve(new CategoryGroupDTO({ ...ocGroup, categories })))
        .catch(reject);
    });

  }

  private updateCategory(inputCategory: CategoryDTO, ocGroup: CategoryGroup, ocCategory: Category): Promise<Category> {
    return new Promise((resolve, reject) => {
      this.checkForValue(ocCategory, `Category "${inputCategory.name}" not found`, HttpStatus.NOT_FOUND);

      ocCategory = {
        ...ocCategory,
        name: inputCategory.name,
        order: inputCategory.order,
        description: inputCategory.description,
        categoryGroup: ocGroup,
      };

      return this.categoryRepositoryService.updateCategory(ocCategory.id, ocCategory)
        .then(() => resolve(ocCategory))
        .catch(reject);
    });
  }

  private checkForValue(value: any, errorMessage: string, status: HttpStatus) {
    if (!value) {
      throw new HttpException(errorMessage, status)
    }
  }
}
