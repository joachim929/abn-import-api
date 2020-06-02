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

@Entity()
export class Rule {
  @PrimaryGeneratedColumn('uuid')
  id: 'string';

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

  @Column({default: false})
  autoAssign: boolean;

  @OneToMany(type => Logic, logic => logic.orRule, {onDelete: 'CASCADE'})
  orLogic: Logic[];

  @OneToMany(type => Logic, logic => logic.andRule, {onDelete: 'CASCADE'})
  andLogic: Logic[];

  /**
   * Rule @ManyToOne
   *
   */
}
