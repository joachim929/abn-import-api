import {
  Column,
  CreateDateColumn,
  Entity, Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/category.entity';
import { Logic } from './logic.entity';

@Entity()
export class TransferCondition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({unique: true})
  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

  @ManyToOne(type => Category, category => category.rules, {cascade: ['insert'], onDelete: 'SET NULL'})
  category: Category;

  @Column({default: false})
  autoAssign: boolean;

  @OneToMany(type => Logic, logic => logic.orCondition, {cascade: ['insert', 'update'], onDelete: 'CASCADE'})
  orLogic: Logic[];

  @OneToMany(type => Logic, logic => logic.andCondition, {cascade: ['insert', 'update'], onDelete: 'CASCADE'})
  andLogic: Logic[];
}
