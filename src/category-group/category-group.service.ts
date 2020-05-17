import { Injectable } from '@nestjs/common';
import { CategoryGroup } from './category-group.entity';
import { CategoryGroupRepositoryService } from './category-group-repository/category-group-repository.service';
import { CategoryGroupDTO } from './dtos/category-group.dto';
import { UpdateResult } from 'typeorm';
import { CategoryDTO } from '../category/dtos/category.dto';
import { CategoryService } from '../category/category.service';
import { CategoryRepositoryService } from '../category/category-repository/category-repository.service';

@Injectable()
export class CategoryGroupService {
  constructor(
    private categoryGroupRepositoryService: CategoryGroupRepositoryService,
    private categoryRepositoryService: CategoryRepositoryService,
    private categoryService: CategoryService,
  ) {
  }

  getCategoryGroup(id: string): Promise<CategoryGroupDTO> {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getGroupById(id)
        .then((response: CategoryGroup) => resolve(new CategoryGroupDTO(response)))
        .catch(reason => reject(reason));
    });
  }

  getAll(): Promise<CategoryGroupDTO[]> {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getGroups()
        .then((response: CategoryGroup[]) => resolve(response.map(categoryGroup => new CategoryGroupDTO(categoryGroup))),
        ).catch(reason => reject(reason));
    });
  }

  getAllWithCategories() {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getGroupsWithCategories()
        .then((response) => resolve(response))
        .catch(reason => reject(reason));
    });
  }

  patchCategoryGroup(categoryGroup: CategoryGroupDTO) {
    return new Promise((resolve, reject) => {
      // this.categoryGroupRepositoryService.getGroupById(categoryGroup.id).then((ocGroup: CategoryGroup) => {
      //   ocGroup.name = categoryGroup.name;
      //   ocGroup.description = categoryGroup.description;
      //   this.categoryGroupRepositoryService.updateGroup(categoryGroup.id, ocGroup)
      //     .then((response: UpdateResult) => resolve(response))
      //     .catch(reason => reject(reason));
      // });
      resolve();
    });
  }

  patchCategoryGroups(categoryGroups: CategoryGroupDTO[]) {
    return new Promise((resolve, reject) => {
      const ocGroupPromises = categoryGroups.map((group) => {
        return this.categoryGroupRepositoryService.getGroupById(group.id);
      });
      Promise.all(ocGroupPromises).then((ocCategoryGroups) => {
        const categoryGroupUpdatePromises = [];
        ocCategoryGroups.map(ocCategoryGroup => {
          categoryGroups.map(patchedGroup => {
            if (patchedGroup.id === ocCategoryGroup.id) {
              ocCategoryGroup.name = patchedGroup.name;
              ocCategoryGroup.description = patchedGroup.description;
              categoryGroupUpdatePromises.push(this.categoryGroupRepositoryService.updateGroup(ocCategoryGroup.id, ocCategoryGroup));
            }
          });
        });
        Promise.all(categoryGroupUpdatePromises).then(() => {
          const categoryPromises = [];

          categoryGroups.map((group) => group.categories.map((category) =>
            this.categoryRepositoryService.getCategoryById(category.id).then((ocCategory) => {
              ocCategory.name = category.name;
              ocCategory.description = category.description;
              ocCategory.order = category.order;
              const parent = ocCategoryGroups.find((ocCategoryGroup) => ocCategoryGroup.id === group.id);
              if (parent) {
                ocCategory.categoryGroup = { ...parent };
              }
              categoryPromises.push(this.categoryRepositoryService.updateCategory(ocCategory.id, ocCategory));
            })));
          Promise.all(categoryPromises).then((result) => {
            resolve(categoryGroups);
          });
        });
      }).catch((reason) => reject(reason));
    });
  }

  deleteCategoryGroup(id: string) {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.deleteGroup(id).then((response) => {
        resolve(response);
      }).catch(reason => reject(reason));
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
      }).catch(reason => reject(reason));
    });
  }

}
