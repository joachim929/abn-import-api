import { Category } from '../category.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength, MinLength, validateSync } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseValidateDTO } from '../../shared/dtos/base-validate.dto';

export class CategoryDTO extends BaseValidateDTO {
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

  constructor(category: Category, validate?: boolean) {
    super();
    this.id = category.id;
    this.name = category.name;
    this.order = category.order;
    this.description = category?.description || null;
    this.validate();

    if (validate) {
      this.validate();
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
  @IsOptional()
  @IsNumber()
  order: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentId: string;

  constructor(category: CreateCategoryDTO) {
    this.name = category.name;
    this.description = category.description || null;
    this.order = category?.order || 0;
    this.parentId = category?.parentId || null;
    this.validate();
  }

  validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
  }
}
