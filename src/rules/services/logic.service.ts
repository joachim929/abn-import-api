import { Injectable } from '@nestjs/common';
import { LogicRepositoryService } from '../repositories/logic-repository.service';
import { LogicDTO } from '../dtos/logic.dto';
import { CreateLogicDTO } from '../dtos/create-logic.dto';
import { Logic } from '../entities/logic.entity';

@Injectable()
export class LogicService {
  constructor(private logicRepo: LogicRepositoryService) {

  }

  get(id: string): Promise<LogicDTO> {
    return this.logicRepo.getLogicById(id).then((logic => new LogicDTO(logic)));
  }

  getAll(): Promise<LogicDTO[]> {
    return new Promise((resolve, reject) => {
      this.logicRepo.getAll().then((response) => {
        resolve(response.map(item => new LogicDTO(item)));
      }).catch(reject);
    });
  }

  post(logic: CreateLogicDTO): Promise<LogicDTO> {
      return this.logicRepo.postLogic(new CreateLogicDTO(logic, true))
        .then((response => new LogicDTO(response)));
  }

  patch(logic: LogicDTO): Promise<LogicDTO> {
    return this.logicRepo.patchLogic(logic.id, new LogicDTO(logic, true))
      .then((logic) => new LogicDTO(logic));
  }

  delete(id: string): Promise<void> {
      return this.logicRepo.deleteLogic(id).then();
  }

  postMultiple(logic: CreateLogicDTO[]): Promise<Logic[]> {
    return this.logicRepo.postMultipleLogic(logic);
  }
}
