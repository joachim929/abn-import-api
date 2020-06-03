import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/category.entity';
import { Logic } from './logic.entity';
import { LogicType } from '../interfaces/logic.type';
import { TransferKeyType } from '../interfaces/transfer-key.type';

@Entity()
export class TransferCondition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

  @ManyToOne(type => Category, category => category.rules, {onDelete: 'SET NULL'})
  category: Category;

  @Column()
  type: LogicType;

  @Column()
  transferKey: TransferKeyType;

  @Column({default: false})
  autoAssign: boolean;

  @OneToMany(type => Logic, logic => logic.orConditions, {onDelete: 'CASCADE'})
  orLogic: Logic[];

  @OneToMany(type => Logic, logic => logic.andConditions, {onDelete: 'CASCADE'})
  andLogic: Logic[];
}
