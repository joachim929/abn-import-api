import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryGroup } from './category-group.entity';
import { CategoryGroupRepositoryService } from './category-group-repository/category-group-repository.service';
import { CategoryGroupDTO } from './dtos/category-group.dto';
import { CategoryDTO } from '../category/dtos/category.dto';
import { CategoryService } from '../category/category.service';
import { CategoryRepositoryService } from '../category/category-repository/category-repository.service';
import { Category } from '../category/category.entity';
import { UpdateResult } from 'typeorm';
import { flatten } from 'lodash';

/**
 * todo:
 *    make generic functions for simple stuff like patching an entry
 *    that can be re-usable instead of re-writing a lot of similar code
 *    maybe also need to write something that only patches the found difference
 *      - Should get original
 *      - Compare to original? Or adjust original
 *      - Return the changed result
 *    Needs to be implemented for category and categoryGroup
 *    Might also want to put in the same module
 */

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
        .catch(reject);
    });
  }

  getAllWithCategories() {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getGroupsWithCategories()
        .then((response) => resolve(response))
        .catch(reject);
    });
  }

  patchCategoryGroup(categoryGroup: CategoryGroupDTO) {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getGroupById(categoryGroup.id).then((ocGroup: CategoryGroup) => {
        ocGroup.name = categoryGroup.name;
        ocGroup.description = categoryGroup.description;
        this.categoryGroupRepositoryService.updateGroup(categoryGroup.id, ocGroup)
          .then((response: UpdateResult) => resolve(response))
          .catch(reject);
      });
      resolve();
    });
  }

  /**
   * todo:
   *    should loop over categoryGroups
   *      - patch each group in a separate function
   *      - patch each category in a separate function
   *      - return updated results
   */
  patchCategoryGroups(categoryGroups: CategoryGroupDTO[]): Promise<CategoryGroupDTO[]> {
    let _updatedGroups = [];
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getByIds(categoryGroups.map(group => group.id))
        .then((ocCategoryGroups) => {

          this.updateCategoryGroup(ocCategoryGroups, categoryGroups).then((updatedGroups) => {

            _updatedGroups = updatedGroups;

            const promises: Promise<Category>[] =  flatten(categoryGroups.map((categoryGroup) =>
              categoryGroup.categories.map((category) =>
                this.updateCategory(category, ocCategoryGroups, categoryGroup.id))));
            return Promise.all(promises);

          }).then((result) => {
              const updatedResults = _updatedGroups.map((group) => new CategoryGroupDTO({ ...group, categories: [] }));
              result.map((updatedCategory) => updatedResults.map((updatedResultGroup) => {
                if (updatedResultGroup.id === updatedCategory.categoryGroup.id) {
                  updatedResultGroup.categories.push(new CategoryDTO(updatedCategory));
                }
                return updatedResultGroup;
              }));

              resolve(updatedResults);
          });
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

  // todo: Is an error in here, need to debug it
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

  private updateCategory(category, ocCategoryGroups: CategoryGroup[], newCategoryId: string): Promise<Category> {
    return new Promise((resolve, reject) => {
      this.categoryRepositoryService.getCategoryById(category.id).then((ocCategory) => {
        ocCategory = {
          ...ocCategory,
          name: category.name,
          description: category.description,
          order: category.order,
        };
        const parent = ocCategoryGroups.find((ocCategoryGroup) => ocCategoryGroup.id === newCategoryId);

        parent ? ocCategory = { ...ocCategory, categoryGroup: parent } : reject();

        this.categoryRepositoryService.updateCategory(ocCategory.id, ocCategory).then(() => resolve(ocCategory));
      }).catch(reject);
    });
  }

  // todo: Need to split this as shouldn't be looping over stuff to find it etc
  private updateCategoryGroup(ocCategoryGroups: CategoryGroup[], groupsToPatch: CategoryGroupDTO[]): Promise<CategoryGroup[]> {
    return new Promise((resolve, reject) => {
      const promises: Promise<UpdateResult>[] = [];

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

      Promise.all(promises)
        .then(() => resolve(ocCategoryGroups))
        .catch(reject);
    });
  }
}
