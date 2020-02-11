import { Module } from '@nestjs/common';
import { CategoryGroupController } from './category-group.controller';
import { CategoryGroupService } from './category-group.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryGroup } from './category-group.entity';
import { CategoryGroupRepositoryService } from './category-group-repository/category-group-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryGroup])],
  controllers: [CategoryGroupController],
  providers: [CategoryGroupService, CategoryGroupRepositoryService],
})
export class CategoryGroupModule {
}
