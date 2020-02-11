import { Module } from '@nestjs/common';
import { CategoryGroupController } from './category-group.controller';
import { CategoryGroupService } from './category-group.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryGroup } from './category-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryGroup])],
  controllers: [CategoryGroupController],
  providers: [CategoryGroupService],
})
export class CategoryGroupModule {
}
