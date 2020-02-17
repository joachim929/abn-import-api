import { Category } from '../category.entity';

export class CategoryDTO {
  id: number;
  name: string;
  description?: string;
  categoryGroupId: number;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.categoryGroupId = category.categoryGroupId;
    if (category.description) {
      this.description = category.description;
    }
  }
}
