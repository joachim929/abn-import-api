import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, Repository, SaveOptions, UpdateResult } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
  ) {
  }

  // Expensive call, should only be used for GDPR reasons
  async getUsers(): Promise<User[]> {
    return await this.repository.find({
      relations: ['invoices', 'categoryGroups', 'categoryGroups.categories'],
    });
  }

  async getUser(id: number): Promise<User[]> {
    return await this.repository.find({
      relations: ['invoices', 'categoryGroups', 'categoryGroups.categories'],
      where: { id },
    });
  }

  async getUserByName(userName: string): Promise<User[]> {
    return await this.repository.find({
      relations: ['invoices', 'categoryGroups', 'categoryGroups.categories'],
      where: { userName },
    });
  }

  async createUser<T extends DeepPartial<User>>(entity: T, options?: SaveOptions): Promise<User>
  async createUser(user: User) {
    return await this.repository.save(user);
  }

  async updateUser(id: number, user: User): Promise<UpdateResult> {
    return await this.repository.update(id, user);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
