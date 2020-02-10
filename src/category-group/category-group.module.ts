import { Module } from '@nestjs/common';
import { CategoryGroupController } from './category-group.controller';
import { CategoryGroupService } from './category-group.service';

@Module({
  controllers: [CategoryGroupController],
  providers: [CategoryGroupService]
})
export class CategoryGroupModule {}
