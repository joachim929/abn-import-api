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

@Entity()
export class TransferMutation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startBalance: number;

  @Column()
  endBalance: number;

  @Column()
  description: string;

  @Column({nullable: true})
  comment: string;

  @Column()
  amount: number;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(type => Transfer, transfer => transfer.mutations)
  transfer: Transfer;

  @ManyToOne(type => TransferMutation, mutation => mutation.children)
  parent: TransferMutation;

  @OneToMany(type => TransferMutation, mutation => mutation.parent)
  children: TransferMutation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
