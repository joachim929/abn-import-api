import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from '@nestjs/common';
import { CategoryGroupService } from './services/category-group.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryGroupDTO, CreateCategoryGroupDTO } from './dtos/category-group.dto';

@ApiTags('CategoryGroupApi')
@Controller('category-group')
export class CategoryGroupController {
  constructor(private service: CategoryGroupService) {
  }

  @Get()
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
  @ApiResponse({
    status: 200, type: [CategoryGroupDTO]
  })
  @ApiBody({ type: [CategoryGroupDTO] })
  patchMultiple(@Body() categories: [CategoryGroupDTO]) {
    return this.service.patchCategoryGroups(categories);
  }

  @Post()
  @ApiResponse({
    status: 200, type: CategoryGroupDTO
  })
  @ApiBody({type: CreateCategoryGroupDTO})
  create(@Body() categoryGroup: CreateCategoryGroupDTO) {
    return this.service.createCategoryGroup(categoryGroup);
  }

  @Delete(':id')
  @ApiResponse({
    status: 204
  })
  @ApiResponse({
    status: 400, type: HttpException
  })
  delete(@Param('id') id: string) {
    return this.service.deleteCategoryGroup(id);
  }

}
