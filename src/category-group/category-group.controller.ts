import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryGroupService } from './category-group.service';
import { CategoryGroup } from './category-group.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Category-group')
@Controller('category-group')
export class CategoryGroupController {
  constructor(private service: CategoryGroupService) {
  }

  @Get('all')
  @ApiOperation({
    operationId: 'getAllCategoryGroups',
  })
  getAll() {
    return this.service.getAll().catch(reason => console.warn(reason));
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getCategoryGroupById',
  })
  get(@Param() params) {
    return this.service.getCategoryGroup(params.id).catch(reason => console.warn(reason));
  }

  @Get()
  @ApiOperation({
    operationId: 'getAllCategoryGroupsWithCategories',
  })
  getAllWithCategories() {
    return this.service.getAllWithCategories().catch(reason => console.warn(reason));
  }

  @Patch(':id')
  @ApiOperation({
    operationId: 'patchCategoryGroup',
  })
  patch(@Body() categoryGroup: CategoryGroup) {
    return this.service.patchCategoryGroup(categoryGroup).catch(reason => console.warn(reason));
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'deleteCategoryGroup',
  })
  delete(@Param() params) {
    return this.service.deleteCategoryGroup(params.id).catch(reason => console.warn(reason));
  }

  @Post()
  @ApiOperation({
    operationId: 'createCategoryGroup',
  })
  create(@Body() categoryGroup: CategoryGroup) {
    return this.service.createCategoryGroup(categoryGroup).catch(reason => console.warn(reason));
  }
}
