import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from '../rule.entity';
import { DeepPartial, Repository, SaveOptions } from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

@Injectable()
export class RulesRepositoryService {
  constructor(@InjectRepository(Rule) private ruleRepository: Repository<Rule>) {
  }

  async getRules(): Promise<Rule[]> {
    return await this.ruleRepository.find();
  }

  async getRuleById(id: number): Promise<Rule[]> {
    return await this.ruleRepository.find({
      relations: ['amount'],
      where: [{ id }],
    });
  }

  async createRule<T extends DeepPartial<Rule>>(entity: T, options?: SaveOptions): Promise<Rule>;
  async createRule(rule: Rule) {
    return await this.ruleRepository.save(rule);
  }

  async updateRule(id: number, rule: Rule): Promise<UpdateResult> {
    return await this.ruleRepository.update(id, rule);
  }

  async deleteRule(id: number): Promise<DeleteResult> {
    return await this.ruleRepository.delete(id);
  }
}
