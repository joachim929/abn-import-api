import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amount } from './amount.entity';
import { AmountService } from './amount.service';
import { AmountRepositoryService } from './amount-repository/amount-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([Amount])],
  providers: [AmountService, AmountRepositoryService],
  exports: [AmountService]
})
export class AmountModule {
}
