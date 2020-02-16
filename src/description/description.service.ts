import { Injectable } from '@nestjs/common';
import { DescriptionRepositoryService } from './description-repository/description-repository.service';
import { DescriptionDTO } from './dtos/description.dto';
import { Description } from './description.entity';
import { UpdateResult } from 'typeorm';
import { rejects } from 'assert';

@Injectable()
export class DescriptionService {
  constructor(private repository: DescriptionRepositoryService) {
  }

  getDescriptionById(id: number): Promise<DescriptionDTO> {
    return new Promise((resolve, reject) => {
      if (typeof id !== 'number') {
        reject(`Id: "${id}" isn't a number`);
      }
      this.repository.getDescriptionById(id).then((response: Description[]) => {
        if (response.length === 1) {
          resolve(new DescriptionDTO(response[0]));
        } else {
          response.length === 0 ? reject(`None found with id: ${id}`) : reject('Too many found');
        }
      });
    });
  }

  getDescriptionByRuleId(ruleId: number): Promise<DescriptionDTO[]> {
    return new Promise((resolve, reject) => {
      if (typeof ruleId !== 'number') {
        reject(`RuleId: "${ruleId}" isn't a number`);
      }

      this.repository.getDescriptionByRuleId(ruleId).then((response: Description[]) => {
        const descriptionReturn: DescriptionDTO[] = [];
        for (const description of response) {
          descriptionReturn.push(new DescriptionDTO(description));
        }
        resolve(descriptionReturn);
      });
    });
  }

  patchDescription(description: Description) {
    return new Promise(resolve => {
      this.repository.patch(description.id, description).then((response: UpdateResult) => {
        // todo: Figure out what to resolve
        resolve(response);
      });
    });
  }

  deleteDescription(id: number): Promise<void> {
    return new Promise(resolve => {
      this.repository.delete(id).then(() => resolve());
    });
  }

  createDescription(description: Description): Promise<DescriptionDTO> {
    return new Promise((resolve) => {
      this.repository.createDescription(description).then((response: Description) => {
        resolve(new DescriptionDTO(response));
      });
    });
  }
}
