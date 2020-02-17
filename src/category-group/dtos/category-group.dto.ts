import { CategoryDTO } from '../../category/dtos/category.dto';
import { CategoryGroup } from '../category-group.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryGroupDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  userId: number;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
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
