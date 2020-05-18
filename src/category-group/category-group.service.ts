import { Injectable } from '@nestjs/common';
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
        this.updateCategoryGroup(ocCategoryGroups, categoryGroups).then((updatedGroups) => {
          updatedGroups.map(item => item.categories = []);
          const updatedSubCategories: Promise<Category>[] = [];
          for (const categoryGroup of categoryGroups) {
            for (const category of categoryGroup.categories) {
              updatedSubCategories.push(new Promise((resolve, reject) => {
                this.categoryRepositoryService.getCategoryById(category.id).then((ocCategory) => {
                  ocCategory = {
                    ...ocCategory, name: category.name, description: category.description, order: category.order,
                  };
                  const parent = ocCategoryGroups.find((ocCategoryGroup) => ocCategoryGroup.id === categoryGroup.id);
                  if (parent) {
                    ocCategory = { ...ocCategory, categoryGroup: parent };
                  }
                  this.categoryRepositoryService.updateCategory(ocCategory.id, ocCategory).then(() => resolve(ocCategory));
                });
              }));
            }
          }

          Promise.all(updatedSubCategories).then((result) => {
            for (const updatedCategory of result) {
              for (const updatedGroup of updatedGroups) {
                if (updatedGroup.id === updatedCategory.categoryGroup.id) {
                  const temp = {
                    id: updatedCategory.id,
                    name: updatedCategory.name,
                    description: updatedCategory.description,
                    order: updatedCategory.order
                  } as Category; // todo still need to fix returning the data
                  updatedGroup.categories.push(temp);
                  break;
                }
              }
            }
            resolve(updatedGroups);
          });
        });

      }).catch((reason) => reject(reason));
    });
  }

  private updateCategoryGroup(ocCategoryGroups: CategoryGroup[], groupsToPatch: CategoryGroupDTO[]): Promise<CategoryGroup[]> {
    return new Promise((resolve, reject) => {
      const promises = [];
      for (let ocGroup of ocCategoryGroups) {
        const groupToPatch = groupsToPatch.find(groupToPatch => groupToPatch.id === ocGroup.id);
        if (groupToPatch) {
          ocGroup = {
            ...ocGroup,
            name: groupToPatch.name,
            description: groupToPatch.description,
          };
          promises.push(this.categoryGroupRepositoryService.updateGroup(ocGroup.id, ocGroup));
        }
      }
      Promise.all(promises).then(() => {
        resolve(ocCategoryGroups);
      }).catch(e => reject(e));
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
