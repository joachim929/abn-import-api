import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './services/transfer.service';
import { TransferRepositoryService } from './repositories/transfer-repository/transfer-repository.service';
import { TransferMutationRepositoryService } from './repositories/transfer-mutation-repository/transfer-mutation-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
import { TransferMutation } from './entities/transfer-mutation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transfer, TransferMutation]),
  ],
  controllers: [TransferController],
  providers: [
    TransferService,
    TransferRepositoryService,
    TransferMutationRepositoryService,
  ],
})
export class TransferModule {
}
