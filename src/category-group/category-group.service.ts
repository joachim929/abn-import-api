import { Injectable } from '@nestjs/common';
import { CategoryGroup } from './category-group.entity';
import { CategoryGroupRepositoryService } from './category-group-repository/category-group-repository.service';
import { CategoryGroupDTO, CreateCategoryGroupDTO } from './dtos/category-group.dto';
import { CategoryDTO } from '../category/dtos/category.dto';
import { CategoryRepositoryService } from '../category/category-repository/category-repository.service';
import { Category } from '../category/category.entity';

@Injectable()
export class CategoryGroupService {
  constructor(
    private categoryGroupRepositoryService: CategoryGroupRepositoryService,
    private categoryRepositoryService: CategoryRepositoryService,
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
          return Promise.all(categoryGroups.map((categoryGroup) => {
            const ocGroup = ocCategoryGroups.find((ocGroup) => categoryGroup.id === ocGroup.id);
            return this.updateCategoryGroup(categoryGroup, ocGroup);
          })).then(resolve)
            .catch(reject);
        }).catch(reject);
    });
  }

  deleteCategoryGroup(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.deleteGroup(id).then(() => {
        resolve();
      }).catch(reject);
    });
  }

  createCategoryGroup(categoryGroup: CreateCategoryGroupDTO): Promise<CategoryGroupDTO> {
    return new Promise((resolve, reject) => {
      const validatedCategoryGroup = new CreateCategoryGroupDTO(categoryGroup);

      this.categoryGroupRepositoryService.createGroup(validatedCategoryGroup).then((createdCategoryGroup) => {

        const promises = validatedCategoryGroup.categories.map((category) =>
          this.categoryRepositoryService.createCategory({...category, categoryGroup: createdCategoryGroup}));

        Promise.all(promises).then((createdCategories) => {
          resolve(new CategoryGroupDTO({...createdCategoryGroup, categories: createdCategories}));
        });

      }).catch(reject);
    });
  }

  private updateCategoryGroup(inputGroup: CategoryGroupDTO, ocGroup: CategoryGroup): Promise<CategoryGroupDTO> {
    return new Promise((resolve, reject) => {
      const validatedInputGroup = new CategoryGroupDTO((inputGroup as unknown) as CategoryGroup);

      ocGroup = { ...ocGroup, name: validatedInputGroup.name, description: validatedInputGroup.description };

      this.categoryGroupRepositoryService.updateGroup(ocGroup.id, ocGroup)
        .then(() =>
          this.categoryRepositoryService.getCategoriesByIds(validatedInputGroup.categories.map(category => category.id)))
        .then((ocCategories: Category[]) =>
          Promise.all(validatedInputGroup.categories.map(category =>
            this.updateCategory(category, ocGroup, ocCategories.find(ocCategory => ocCategory.id === category.id)))))
        .then((categories) => resolve(new CategoryGroupDTO({ ...ocGroup, categories })))
        .catch(reject);
    });

  }

  private updateCategory(inputCategory: CategoryDTO, ocGroup: CategoryGroup, ocCategory: Category): Promise<Category> {
    return new Promise((resolve, reject) => {

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
}
