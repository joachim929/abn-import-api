import { CategoryDTO } from '../../category/dtos/category.dto';
import { CategoryGroup } from '../category-group.entity';

export class CategoryGroupDTO {
  id: number;
  name: string;
  userId: number;
  description?: string;
  categories?: CategoryDTO[];

  constructor(categoryGroup: CategoryGroup) {
    this.id = categoryGroup.id;
    this.name = categoryGroup.name;
    this.userId = categoryGroup.userId;
    if (categoryGroup.description) {
      this.description = categoryGroup.description;
    }

    this.categories = [];
    for (const category of categoryGroup.categories) {
      this.categories.push(new CategoryDTO(category));
    }

  }
}
