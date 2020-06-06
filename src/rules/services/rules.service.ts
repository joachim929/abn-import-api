import { Injectable } from '@nestjs/common';
import { CreateTransferConditionDto } from '../dtos/create-transfer-condition.dto';
import { TransferConditionRepositoryService } from '../repositories/transfer-condition-repository.service';
import { TransferConditionDTO } from '../dtos/transfer-condition.dto';

@Injectable()
export class RulesService {

  constructor(
    private transferConditionRepository: TransferConditionRepositoryService,
  ) {
  }

  post(rule: CreateTransferConditionDto) {
    return this.transferConditionRepository.post(new CreateTransferConditionDto(rule, true));
  }

  get(id: string) {
    return new Promise((resolve, reject) => {
      this.transferConditionRepository.getById(id).then((response) => {
        resolve(new TransferConditionDTO(response));
      }).catch(reject);
    });
  }

  getWithRelationsShips(id: string) {
    return new Promise((resolve, reject) => {
      this.transferConditionRepository.getById(id, [
        'category',
        'orLogic',
        'andLogic',
        'andLogic.values',
        'orLogic.values'
      ]).then((response) => {
        resolve(new TransferConditionDTO(response))
      }).catch(reject);
    })
  }
}
