import { Module } from '@nestjs/common';
import { DescriptionService } from './description.service';
import { DescriptionRepositoryService } from './description-repository/description-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Description } from './description.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Description])],
  providers: [DescriptionService, DescriptionRepositoryService],
  exports: [DescriptionService]
})
export class DescriptionModule {
}
