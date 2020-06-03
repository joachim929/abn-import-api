import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CategoryGroup } from './category-group.entity';
import { TransferMutation } from '../transfer/entities/transfer-mutation.entity';
import { TransferCondition } from '../rules/entities/transfer-condition.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(type => CategoryGroup, categoryGroup => categoryGroup.categories, { onDelete: 'CASCADE' })
  categoryGroup: CategoryGroup;

  @OneToMany(type => TransferMutation, mutation => mutation.category, { cascade: ['update'], onDelete: 'SET NULL' })
  mutations: TransferMutation[];

  @OneToMany(type => TransferCondition, rules => rules.category, {onDelete: 'SET NULL'})
  rules: TransferCondition[];
}
