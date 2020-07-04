import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryDTO, CreateCategoryDTO } from './dtos/category.dto';

@ApiTags('CategoryApi')
@Controller('category')
export class CategoryController {
  constructor(
    private service: CategoryService,
  ) {
  }

  @Get()
  @ApiResponse({
    status: 200, type: [CategoryDTO]
  })
  getAll() {
    return this.service.getAll();
  }

  @Patch()
  @ApiResponse({
    status: 200, type: CategoryDTO
  })
  patch(@Body() category: CategoryDTO) {
    return this.service.patchCategory(category);
  }

  @Get(':id')
  @ApiResponse({
    status: 200, type: CategoryDTO
  })
  get(@Param() params) {
    return this.service.getCategory(params.id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 204
  })
  delete(@Param('id') id: number) {
    return this.service.deleteCategory(id);
  }

  @Post(':parentId')
  @ApiResponse({
    status: 201, type: CategoryDTO
  })
  create(@Param('parentId') parentId: string, @Body() category: CreateCategoryDTO) {
    return this.service.createCategory(category, parentId);
  }

}
