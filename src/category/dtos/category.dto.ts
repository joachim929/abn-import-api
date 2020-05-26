import { Category } from '../category.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength, MinLength, validateSync } from 'class-validator';

export class CategoryDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.order = category.order;
    this.description = category?.description || null;
    this.validate();
  }

  validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      console.log(errors);
    }
  }
}

export class CreateCategoryDTO {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  constructor(category: CreateCategoryDTO) {
    this.name = category.name;
    this.description = category.description || null;
    this.order = category.order;
    this.validate();
  }

  validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      console.log(errors);
    }
  }
}
