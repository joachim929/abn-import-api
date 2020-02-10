import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from './rule.entity';
import { Repository } from 'typeorm';
import { of } from 'rxjs';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule) private ruleRepository: Repository<Rule>,
  ) {
  }

  getRule(id: number) {
    return of([]);
  }

  patchRule(rule: Rule) {
    return 'WIP';
  }
}
