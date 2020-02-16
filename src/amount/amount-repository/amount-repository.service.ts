import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Amount } from '../amount.entity';
import { DeepPartial, DeleteResult, Repository, SaveOptions, UpdateResult } from 'typeorm';

@Injectable()
export class AmountRepositoryService {
  constructor(
    @InjectRepository(Amount) private repository: Repository<Amount>,
  ) {
  }

  async getAmountById(id: number) {
    return await this.repository.find({
      where: [{ id }],
    });
  }

  async getAmountByRuleId(ruleId: number) {
    return await this.repository.find({
      where: [{ ruleId }],
    });
  }

  async createAmount<T extends DeepPartial<Amount>>(entity: T, options?: SaveOptions): Promise<Amount>
  async createAmount(amount: Amount) {
    return await this.repository.save(amount);
  }

  async patchAmount(id: number, amount: Amount): Promise<UpdateResult> {
    return await this.repository.update(id, amount);
  }

  async deleteAmount(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
