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

  @ManyToOne(() => Category, category => category.mutations, {cascade: ['insert'], onDelete: 'SET NULL'})
  category: Category;

  @ManyToOne(() => Transfer, transfer => transfer.mutations)
  transfer: Transfer;

  @ManyToOne(() => TransferMutation, mutation => mutation.children, {cascade: ['insert']})
  parent: TransferMutation;

  @OneToMany(() => TransferMutation, mutation => mutation.parent, {cascade: ['insert']})
  children: TransferMutation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
