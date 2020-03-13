import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TransferMutation } from './transfer-mutation.entity';

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hash: string;

  @Column()
  accountNumber: number;

  @Column()
  startBalance: number;

  @Column()
  endBalance: number;

  @Column()
  currencyCode: string;

  @Column()
  valueDate: Date;

  @Column()
  transactionDate: Date;

  @Column({default: true})
  active: boolean;

  @OneToMany(type => TransferMutation, mutation => mutation.transfer)
  mutations: TransferMutation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
