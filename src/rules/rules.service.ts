import { Injectable } from '@nestjs/common';
import { Rule } from './rule.entity';
import { RulesRepositoryService } from './rules-repository/rules-repository.service';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { AmountService } from '../amount/amount.service';
import { RuleDTO } from './dtos/rule.dto';
import { DescriptionService } from '../description/description.service';
import { AmountDTO } from '../amount/dtos/amount.dto';

@Injectable()
export class RulesService {
  constructor(
    private rulesRepositoryService: RulesRepositoryService,
    private amountService: AmountService,
    private descriptionService: DescriptionService,
  ) {
  }

  getRule(id: number): Promise<RuleDTO> {
    return new Promise((resolve, reject) => {
      this.rulesRepositoryService.getRuleById(id).then((rulesResponse: Rule[]) => {
        if (rulesResponse.length > 1) {
          reject('Found more than 1 entry');
        } else {
          this.amountService.getAmountByRuleId(rulesResponse[0].id).then((amountResponse) => {
            resolve(new RuleDTO(rulesResponse[0], amountResponse));
          });
        }
      }).catch(reason => reject(reason));
    });
  }

  getAll(): Promise<RuleDTO[]> {
    return new Promise((resolve, reject) => {
      const rulesResponse: RuleDTO[] = [];
      this.rulesRepositoryService.getRules().then((rules: Rule[]) => {
        for (let i = 0; i < rules.length; i++) {
          this.amountService.getAmountByRuleId(rules[i].id).then((amountResponse) => {
            this.descriptionService.getDescriptionByRuleId(rules[i].id).then((descriptionResponse) => {
              rulesResponse.push(new RuleDTO(rules[i], amountResponse, descriptionResponse));
              if (i === rules.length - 1) {
                resolve(rulesResponse);
              }
            });
          }).catch(reason => reject(reason));
        }
      }).catch(reason => reject(reason));
    });
  }

  patchRule(rule: Rule) {
    return new Promise((resolve, reject) => {
      this.rulesRepositoryService.updateRule(rule.id, rule).then((response: UpdateResult) => {
        resolve();
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

  createRules(rules: Rule[]) {
    return new Promise((resolve, reject) => {
      const promises: Promise<Rule>[] = [];
      for (const rule of rules) {
        promises.push(this.createRule(rule));
      }
      Promise.all(promises).then((response: Rule[]) => {
        resolve(response);
      });
    });
  }

  private createRule(rule): Promise<Rule> {
    let newRule;
    return new Promise((resolve, reject) => {
      this.rulesRepositoryService.createRule(rule).then((response: Rule) => {
        newRule = response;
        this.createAmounts(rule, response.id).then((response) => {
          newRule.amount = response;
          this.createDescriptions(rule, newRule.id).then(response => {
            newRule.description = response;
            resolve(newRule);
          });
        });
        resolve(newRule);
      });
    });
  }

  private createDescriptions(rule, ruleId: number) {
    return new Promise(resolve => {
      if (rule.description instanceof Array && rule.description.length > 0) {
        const descriptionPromises = [];
        for (const description of rule.description) {
          description.ruleId = ruleId;
          descriptionPromises.push(this.descriptionService.createDescription(description));
        }
        Promise.all(descriptionPromises).then(response => resolve(response));
      } else {
        resolve([]);
      }
    });
  }

  private createAmounts(rule, ruleId: number): Promise<AmountDTO[]> {
    return new Promise(resolve => {
      if (rule.amount instanceof Array && rule.amount.length > 0) {
        const amountPromises = [];
        for (const amount of rule.amount) {
          amount.ruleId = ruleId;
          amountPromises.push(this.amountService.createAmount(amount));
        }
        Promise.all(amountPromises).then(response => resolve(response));
      } else {
        resolve([]);
      }
    });
  }
}
