import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryGroupService } from './category-group.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    return this.service.getAllWithCategories();
  }

  @Patch()
  @ApiOperation({
    operationId: 'patchMultiple'
  })
  @ApiResponse({
    status: 200, type: [CategoryGroupDTO]
  })
  @ApiBody({ type: [CategoryGroupDTO] })
  patchMultiple(@Body() categories: [CategoryGroupDTO]) {
    return this.service.patchCategoryGroups(categories);
  }

  @Post()
  @ApiOperation({
    operationId: 'createCategoryGroup',
  })
  @ApiResponse({
    status: 200, type: CategoryGroupDTO
  })
  create(@Body() categoryGroup: CategoryGroupDTO) {
    return this.service.createCategoryGroup(categoryGroup);
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'deleteCategoryGroup',
  })
  delete(@Param() params) {
    return this.service.deleteCategoryGroup(params.id);
  }

}
