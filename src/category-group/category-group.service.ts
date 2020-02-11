import { Injectable } from '@nestjs/common';
import { CategoryGroup } from './category-group.entity';
import { CategoryGroupRepositoryService } from './category-group-repository/category-group-repository.service';

@Injectable()
export class CategoryGroupService {
  constructor(private categoryGroupRepositoryService: CategoryGroupRepositoryService) {
  }

  getCategoryGroup(id: number) {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getGroupsById(id).then((response) => {
        console.log(response);
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getGroups().then((response) => {
        console.log(response);
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  getAllWithCategories() {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getGroupsWithCategories().then((response) => {
        console.log(response);
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  patchCategoryGroup(categoryGroup: CategoryGroup) {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.updateGroup(categoryGroup.id, categoryGroup).then((response) => {
        console.log(response);
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  deleteCategoryGroup(id: number) {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.deleteGroup(id).then((response) => {
        console.log(response);
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  createCategoryGroup(categoryGroup: CategoryGroup) {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.createGroup(categoryGroup).then((response) => {
        console.log(response);
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

}
