import { Category } from '../category.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  categoryGroupId: string;

  @ApiProperty()
  order: number;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.categoryGroupId = category.categoryGroup.id;
    this.order = category.order;
    this.description = category?.description || null;
  }
}
