import { Injectable } from '@nestjs/common';
import { Rule } from './rule.entity';
import { RulesRepositoryService } from './rules-repository/rules-repository.service';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { AmountService } from '../amount/amount.service';
import { Amount } from '../amount/amount.entity';
import { RuleDto } from './dto/rule.dto';

@Injectable()
export class RulesService {
  constructor(
    private rulesRepositoryService: RulesRepositoryService,
    private amountService: AmountService,
  ) {
  }

  getRule(id: number): Promise<Rule> {
    return new Promise((resolve, reject) => {
      this.rulesRepositoryService.getRuleById(id).then((response: Rule[]) => {
        if (response.length > 1) {
          reject('Found more than 1 entry');
        } else {
          resolve(response[0]);
        }
      }).catch(reason => reject(reason));
    });
  }

  getAll(): Promise<RuleDto[]> {
    return new Promise((resolve, reject) => {
      const rulesResponse: RuleDto[] = []
      this.rulesRepositoryService.getRules().then((rules: Rule[]) => {
        for (let i = 0; i < rules.length; i++) {
          this.amountService.getAmountByRuleId(rules[i].id).then((response) => {
            rulesResponse.push(new RuleDto(rules[i], response));
            if (i === rules.length - 1) {
              resolve(rulesResponse);
            }
          }).catch(reason => reject(reason));
        }
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
        if (rule.amount instanceof Array && rule.amount.length > 0) {
          this.createAmounts(rule.amount, response.id).then((response) => {
            newRule.amount = response;
            resolve(newRule);
          });
        }
        resolve(newRule);
      });
    });
  }

  private createAmounts(amountRules: Amount[], ruleId: number) {
    return new Promise(resolve => {
      const amountPromises = [];
      for (const amount of amountRules) {
        amount.ruleId = ruleId;
        amountPromises.push(this.amountService.createAmount(amount));
      }
      Promise.all(amountPromises).then(response => resolve(response));
    });
  }
}
