import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Controller('category')
export class CategoryController {
  constructor(
    private service: CategoryService,
  ) {
  }

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  get(@Param() params) {
    return this.service.getCategory(params.id);
  }

  @Patch(':id')
  patch(@Body() category: Category) {
    return this.service.patchCategory(category);
  }

  @Delete(':id')
  delete(@Param() params) {
    return this.service.deleteCategory(params.id);
  }

  @Post()
  create(@Body() category: Category) {
    return this.service.createCategory(category);
  }

}
