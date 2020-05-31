import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transfer } from './transfer.entity';
import { Category } from '../../category/category.entity';

@Entity()
export class TransferMutation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({nullable: true})
  comment: string;

  @Column()
  amount: number;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(type => Category, category => category.mutations)
  category: Category;

  @ManyToOne(type => Transfer, transfer => transfer.mutations)
  transfer: Transfer;

  @ManyToOne(type => TransferMutation, mutation => mutation.children, {cascade: ['insert']})
  parent: TransferMutation;

  @OneToMany(type => TransferMutation, mutation => mutation.parent, {cascade: ['insert']})
  children: TransferMutation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
