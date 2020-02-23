import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryDTO } from './dtos/category.dto';

@ApiTags('Category')
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

  @Patch(':id')
  @ApiOperation({
    operationId: 'patchCategory',
  })
  @ApiResponse({
    status: 204
  })
  patch(@Body() category: Category) {
    return this.service.patchCategory(category);
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'deleteCategory',
  })
  @ApiResponse({
    status: 204
  })
  delete(@Param() params) {
    return this.service.deleteCategory(params.id);
  }

  @Post()
  @ApiOperation({
    operationId: 'createCategory',
  })
  @ApiResponse({
    status: 200, type: CategoryDTO
  })
  create(@Body() category: Category) {
    return this.service.createCategory(category);
  }

}
