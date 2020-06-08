import { Injectable } from '@nestjs/common';
import { CreateTransferConditionDTO } from '../dtos/create-transfer-condition.dto';
import { TransferConditionRepositoryService } from '../repositories/transfer-condition-repository.service';
import { TransferConditionDTO } from '../dtos/transfer-condition.dto';
import { LogicRepositoryService } from '../repositories/logic-repository.service';
import { Logic } from '../entities/logic.entity';
import { LogicDTO } from '../dtos/logic.dto';
import { LogicService } from './logic.service';
import { CreateLogicDTO } from '../dtos/create-logic.dto';

@Injectable()
export class RulesService {

  constructor(
    private transferConditionRepository: TransferConditionRepositoryService,
    private logicRepositoryService: LogicRepositoryService,
    private logicService: LogicService,
  ) {
  }

  post(rule: CreateTransferConditionDTO): Promise<TransferConditionDTO> {
    return new Promise((resolve, reject) => {
      const temp = new CreateTransferConditionDTO(rule, true);
      const validated = {
        name: temp.name,
        description: temp.description,
        category: temp.category,
        autoAssign: temp.autoAssign,
      };
      this.transferConditionRepository
        .post(validated)
        .then((transferCondition) => {
          // todo: Move this section to LogicService
          const newOrLogic = temp.orLogic.map((logic) => new CreateLogicDTO({
            ...logic,
            orCondition: transferCondition,
          } as CreateLogicDTO));
          const newAndLogic = temp.andLogic.map((logic) => new CreateLogicDTO({
            ...logic,
            andCondition: transferCondition,
          } as CreateLogicDTO));

          Promise.all([this.logicService.postMultiple(newOrLogic), this.logicService.postMultiple(newAndLogic)]).then(([andLogic, orLogic]) => {
            resolve({
              ...temp,
              orLogic: orLogic.map((item) => new LogicDTO(item)),
              andLogic: andLogic.map((item) => new LogicDTO(item)),
            } as TransferConditionDTO);
          });

        }).catch(reject);
    });
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