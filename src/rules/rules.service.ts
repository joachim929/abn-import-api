import { Injectable } from '@nestjs/common';
import { Rule } from './rule.entity';
import { RulesRepositoryService } from './rules-repository/rules-repository.service';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

@Injectable()
export class RulesService {
  constructor(
    private rulesRepositoryService: RulesRepositoryService,
  ) {
  }

  getRule(id: number): Promise<Rule> {
    return new Promise((resolve, reject) => {
      this.rulesRepositoryService.getRuleById(id).then((response: Rule[]) => {
        console.log(response);
        if (response.length > 1) {
          reject('Found more than 1 entry');
        } else {
          resolve(response[0]);
        }
      }).catch(reason => reject(reason));
    });
  }

  getAll(): Promise<Rule[]> {
    return new Promise((resolve, reject) => {
      this.rulesRepositoryService.getRules().then((response: Rule[]) => {
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  patchRule(rule: Rule) {
    return new Promise((resolve, reject) => {
      this.rulesRepositoryService.updateRule(rule.id, rule).then((response: UpdateResult) => {
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }

  deleteRule(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.rulesRepositoryService.deleteRule(id).then((response: DeleteResult) => {
        if (response.raw.length === 0) {
          resolve();
        } else {
          reject(response.raw);
        }
      }).catch(reason => reject(reason));
    });
  }

  createRule(rule: Rule) {
    return new Promise((resolve, reject) => {
      this.rulesRepositoryService.createRule(rule).then((response: Rule) => {
        resolve(response);
      }).catch(reason => reject(reason));
    });
  }
}
