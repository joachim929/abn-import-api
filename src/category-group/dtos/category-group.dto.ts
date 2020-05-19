import { CategoryDTO } from '../../category/dtos/category.dto';
import { CategoryGroup } from '../category-group.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
    this.description = categoryGroup?.description || null;
    this.categories = [];
    for (const category of categoryGroup?.categories) {
      this.categories.push(new CategoryDTO(category));
    }

  }
}
