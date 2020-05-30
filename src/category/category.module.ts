import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './services/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryRepositoryService } from './repositories/category-repository/category-repository.service';
import { CategoryGroup } from './category-group.entity';
import { CategoryGroupController } from './category-group.controller';
import { CategoryGroupService } from './services/category-group.service';
import { CategoryGroupRepositoryService } from './repositories/category-group-repository/category-group-repository.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, CategoryGroup])
  ],
  controllers: [
    CategoryController,
    CategoryGroupController
  ],
  providers: [
    CategoryService,
    CategoryRepositoryService,
    CategoryGroupService,
    CategoryGroupRepositoryService
  ],
  exports: [
    CategoryService, CategoryRepositoryService
  ]
})
export class CategoryModule {}
