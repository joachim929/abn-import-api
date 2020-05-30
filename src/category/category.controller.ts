import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { Category } from './category.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryDTO, CreateCategoryDTO } from './dtos/category.dto';
import { CategoryGroupDTO } from './dtos/category-group.dto';

@ApiTags('CategoryApi')
@Controller('category')
export class CategoryController {
  constructor(
    private service: CategoryService,
  ) {
  }

  @Get()
  @ApiOperation({
    operationId: 'getAllCategories',
  })
  @ApiResponse({
    status: 200, type: [CategoryDTO]
  })
  getAll() {
    return this.service.getAll();
  }

  @Patch()
  @ApiOperation({
    operationId: 'patchCategory',
  })
  @ApiResponse({
    status: 200, type: CategoryDTO
  })
  patch(@Body() category: CategoryDTO) {
    return this.service.patchCategory(category);
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getCategoryById',
  })
  @ApiResponse({
    status: 200, type: CategoryDTO
  })
  get(@Param() params) {
    return this.service.getCategory(params.id);
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'deleteCategory',
  })
  @ApiResponse({
    status: 204
  })
  delete(@Param('id') id: number) {
    return this.service.deleteCategory(id);
  }

  @Post(':parentId')
  @ApiOperation({
    operationId: 'createCategory',
  })
  @ApiResponse({
    status: 201, type: CategoryDTO
  })
  create(@Param('parentId') parentId: string, @Body() category: CreateCategoryDTO) {
    console.log(parentId);
    return this.service.createCategory(category, parentId);
  }

}
