import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransferRepositoryService } from '../../repositories/transfer-repository/transfer-repository.service';
import { TransferMutationRepositoryService } from '../../repositories/transfer-mutation-repository/transfer-mutation-repository.service';
import { CategoryRepositoryService } from '../../../category/repositories/category-repository/category-repository.service';

@Injectable()
export class TransferBaseService {
  constructor(
    protected transferRepository: TransferRepositoryService,
    protected transferMutationRepository: TransferMutationRepositoryService,
    protected categoryRepositoryService: CategoryRepositoryService
  ) {
  }

  protected badRequest(reason: string) {
    throw new HttpException(reason, HttpStatus.BAD_REQUEST);
  }

  protected internalError(reason: string) {
    throw new HttpException(reason, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
