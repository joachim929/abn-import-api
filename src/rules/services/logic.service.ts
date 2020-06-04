import { Injectable } from '@nestjs/common';
import { LogicRepositoryService } from '../repositories/logic-repository.service';
import { LogicDTO } from '../dtos/logic.dto';

@Injectable()
export class LogicService {
  constructor(private logicRepo: LogicRepositoryService) {

  }

  get(id: string): Promise<LogicDTO> {
    return this.logicRepo.getLogicById(id).then((logic => new LogicDTO(logic)));
  }

  post(logic: LogicDTO): Promise<LogicDTO> {
    return this.logicRepo.postLogic(logic).then((logic => new LogicDTO(logic)));
  }

  patch(logic: LogicDTO): Promise<LogicDTO> {
    return this.logicRepo.patchLogic(logic.id, logic).then((logic) => new LogicDTO(logic));
  }

  delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logicRepo.deleteLogic(id).then(() => resolve).catch(reject);
    });
  }
}
