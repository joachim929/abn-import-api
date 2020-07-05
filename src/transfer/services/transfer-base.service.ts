import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransferRepositoryService } from '../repositories/transfer-repository.service';
import { TransferMutationRepositoryService } from '../repositories/transfer-mutation-repository.service';
import { CategoryRepositoryService } from '../../category/repositories/category-repository.service';
import { TransferMutationDTO } from '../dtos/transfer-batch-import.dto';
import { TransferMutation } from '../entities/transfer-mutation.entity';
import { Category } from '../../category/category.entity';

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

  protected getNewMutationCategory(newMutation: TransferMutationDTO, originalMutation: TransferMutation): Promise<Category> {
    return new Promise((resolve, reject) => {
      if (newMutation.category?.id && originalMutation.category?.id && newMutation.category.id !== originalMutation.category.id) {
        this.categoryRepositoryService.getCategoryById(newMutation.category.id).then((category: Category) => {
          resolve(category);
        }).catch(reject);
      } else {
        resolve(null);
      }
    })
  }
}
