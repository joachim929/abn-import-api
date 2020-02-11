import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryGroupService } from './category-group.service';
import { CategoryGroup } from './category-group.entity';

@Controller('api/category-group')
export class CategoryGroupController {
  constructor(private service: CategoryGroupService) {
  }

  @Get('all')
  getAll() {
    return this.service.getAll().catch(reason => console.warn(reason));
  }

  @Get(':id')
  get(@Param() params) {
    return this.service.getCategoryGroup(params.id).catch(reason => console.warn(reason));
  }

  @Get()
  getAllWithCategories() {
    return this.service.getAllWithCategories().catch(reason => console.warn(reason));
  }

  @Patch(':id')
  patch(@Body() categoryGroup: CategoryGroup) {
    return this.service.patchCategoryGroup(categoryGroup).catch(reason => console.warn(reason));
  }

  @Delete(':id')
  delete(@Param() params) {
    return this.service.deleteCategoryGroup(params.id).catch(reason => console.warn(reason));
  }

  @Post()
  create(@Body() categoryGroup: CategoryGroup) {
    return this.service.createCategoryGroup(categoryGroup).catch(reason => console.warn(reason));
  }
}
