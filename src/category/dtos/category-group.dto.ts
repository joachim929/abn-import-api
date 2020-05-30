import { CategoryDTO, CreateCategoryDTO } from './category.dto';
import { CategoryGroup } from '../category-group.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryGroupDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: CategoryDTO,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @Type(() => CreateCategoryDTO)
  @ValidateNested()
  categories?: CategoryDTO[];

  constructor(categoryGroup: CategoryGroup) {
    this.id = categoryGroup.id;
    this.name = categoryGroup.name;
    this.description = categoryGroup?.description || null;
    this.categories = categoryGroup?.categories.map(category => new CategoryDTO({...category, categoryGroup}));
    this.categories = [...this.categories].sort((a, b) => a.order - b.order);
    this.validate();
  }

  validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      console.log(errors);
    }
  }
}

export class CreateCategoryGroupDTO {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    type: CreateCategoryDTO,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @Type(() => CreateCategoryDTO)
  @ValidateNested()
  categories?: CreateCategoryDTO[];

  constructor(categoryGroup: CreateCategoryGroupDTO) {

      this.description = categoryGroup.description || null;
      this.name = categoryGroup.name;
      this.categories = categoryGroup.categories.map((category) => new CreateCategoryDTO(category));
      this.validate();
  }

  validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      console.log(errors);
    }
  }
}
