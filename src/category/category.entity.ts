import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn, OneToMany,
} from 'typeorm';
import { CategoryGroup } from './category-group.entity';
import { TransferMutation } from '../transfer/entities/transfer-mutation.entity';

/**
 * Need to add ordering to this
 */
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

  @Column({default: 0})
  order: number;

  @ManyToOne(type => CategoryGroup)
  @JoinColumn({name: 'categoryGroupId', referencedColumnName: 'id'})
  categoryGroup: CategoryGroup;

  @OneToMany(type => TransferMutation, mutation => mutation.category)
  mutations: TransferMutation[];
}
