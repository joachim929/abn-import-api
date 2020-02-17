import { Injectable } from '@nestjs/common';
import { CategoryGroup } from './category-group.entity';
import { CategoryGroupRepositoryService } from './category-group-repository/category-group-repository.service';
import { CategoryGroupDTO } from './dtos/category-group.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class CategoryGroupService {
  constructor(private categoryGroupRepositoryService: CategoryGroupRepositoryService) {
  }

  getCategoryGroup(id: number): Promise<CategoryGroupDTO> {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getGroupsById(id).then((response: CategoryGroup[]) => {
        if (response.length === 1) {
          resolve(new CategoryGroupDTO(response[0]));
        } else {
          reject(response.length === 0 ? 'None found' : 'Too many found');
        }
      }).catch(reason => reject(reason));
    });
  }

  getAll(): Promise<CategoryGroupDTO[]> {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getGroups().then((response: CategoryGroup[]) => {
        resolve(response.map(categoryGroup => new CategoryGroupDTO(categoryGroup)));
      }).catch(reason => reject(reason));
    });
  }

  getAllWithCategories() {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.getGroupsWithCategories().then((response) => {
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  patchCategoryGroup(categoryGroup: CategoryGroup) {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.updateGroup(categoryGroup.id, categoryGroup).then((response: UpdateResult) => {
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  deleteCategoryGroup(id: number) {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.deleteGroup(id).then((response) => {
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  createCategoryGroup(categoryGroup: CategoryGroup): Promise<CategoryGroupDTO> {
    return new Promise((resolve, reject) => {
      this.categoryGroupRepositoryService.createGroup(categoryGroup).then((response: CategoryGroup) => {
        resolve(new CategoryGroupDTO(response));
      }).catch(reason => reject(reason));
    });
  }

}
