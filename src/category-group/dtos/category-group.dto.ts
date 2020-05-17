import { CategoryDTO } from '../../category/dtos/category.dto';
import { CategoryGroup } from '../category-group.entity';
import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';

export class CategoryGroupDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({
    type: CategoryDTO,
    isArray: true
  })
  categories?: CategoryDTO[];

  constructor(categoryGroup: CategoryGroup) {
    this.id = categoryGroup.id;
    this.name = categoryGroup.name;
    if (categoryGroup.description) {
      this.description = categoryGroup.description;
    }

    this.categories = [];
    for (const category of categoryGroup.categories) {
      this.categories.push(new CategoryDTO(category));
    }

  }
}
