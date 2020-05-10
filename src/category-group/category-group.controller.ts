import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryGroupService } from './category-group.service';
import { CategoryGroup } from './category-group.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryGroupDTO } from './dtos/category-group.dto';

@ApiTags('CategoryGroupApi')
@Controller('category-group')
export class CategoryGroupController {
  constructor(private service: CategoryGroupService) {
  }


  @Get()
  @ApiOperation({
    operationId: 'getAllCategoryGroupsWithCategories',
  })
  @ApiResponse({
    status: 200, description: 'Found records', type: [CategoryGroupDTO]
  })
  @ApiResponse({
    status: 204, description: 'No content'
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // When auth works
  })
  getAllWithCategories() {
    console.log('getAllCategoryGroupsWithCategories');
    return this.service.getAllWithCategories().catch(reason => console.warn(reason));
  }

  @Post()
  @ApiOperation({
    operationId: 'createCategoryGroup',
  })
  create(@Body() categoryGroup: CategoryGroup) {
    console.log('createCategoryGroup');
    return this.service.createCategoryGroup(categoryGroup).catch(reason => console.warn(reason));
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getCategoryGroupById',
  })
  @ApiResponse({
    status: 200, description: 'Found records', type: CategoryGroupDTO
  })
  @ApiResponse({
    status: 204, description: 'No content'
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized', // When auth works
  })
  get(@Param() params) {
    console.log('getCategoryGroupById');
    return this.service.getCategoryGroup(params.id).catch(reason => console.warn(reason));
  }

  @Patch(':id')
  @ApiOperation({
    operationId: 'patchCategoryGroup',
  })
  patch(@Body() categoryGroup: CategoryGroup) {
    console.log('patchCategoryGroup');
    return this.service.patchCategoryGroup(categoryGroup).catch(reason => console.warn(reason));
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'deleteCategoryGroup',
  })
  delete(@Param() params) {
    console.log('deleteCategoryGroup');
    return this.service.deleteCategoryGroup(params.id).catch(reason => console.warn(reason));
  }


  @Patch('multiple')
  @ApiOperation({
    operationId: 'patchMultiple'
  })
  @ApiResponse({
    status: 200
  })
  patchMultiple(@Body() categories: CategoryGroupDTO[]) {
    return this.service.patchCategoryGroups(categories);
  }
}
