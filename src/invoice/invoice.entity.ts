import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  originalId: number;

  @Column()
  accountNumber: number;

  @Column()
  mutationCode: string;

  // todo: add the other date from raw data, just for the hell of it
  @Column({ nullable: true })
  transactionDate: Date;

  @Column()
  startBalance: number;

  @Column()
  endBalance: number;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: true })
  categoryId: number;

  @Column()
  userId: number;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

}
