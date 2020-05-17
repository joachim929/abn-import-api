import { Module } from '@nestjs/common';
import { CategoryGroupController } from './category-group.controller';
import { CategoryGroupService } from './category-group.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryGroup } from './category-group.entity';
import { CategoryGroupRepositoryService } from './category-group-repository/category-group-repository.service';
// import { CategoryRepositoryService } from '../category/category-repository/category-repository.service';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryGroup]), CategoryModule],
  controllers: [CategoryGroupController],
  providers: [CategoryGroupService, CategoryGroupRepositoryService, CategoryService],
})
export class CategoryGroupModule {
}
