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

  post(rule: CreateTransferConditionDto): Promise<TransferConditionDTO> {
    return this.transferConditionRepository
      .post(new CreateTransferConditionDto(rule, true))
      .then((response) => new TransferConditionDTO(response));
  }

  get(id: string): Promise<TransferConditionDTO> {
    return this.transferConditionRepository.getById(id).then((response) => new TransferConditionDTO(response));
  }

  getAll(): Promise<TransferConditionDTO[]> {
    return this.transferConditionRepository.getAll()
      .then((response) => response.map((condition) => new TransferConditionDTO(condition)));
  }

  getWithRelationsShips(id: string): Promise<TransferConditionDTO> {
    return this.transferConditionRepository.getById(id, [
      'category',
      'orLogic',
      'andLogic',
      'andLogic.values',
      'orLogic.values',
    ]).then((response) => new TransferConditionDTO(response));
  }

  patch(rule: TransferConditionDTO): Promise<TransferConditionDTO> {
    return this.transferConditionRepository.patch(rule.id, new TransferConditionDTO(rule))
      .then((response) => new TransferConditionDTO(response));
  }

  delete(id: string): Promise<void> {
    return this.transferConditionRepository.delete(id).then();
  }
}
