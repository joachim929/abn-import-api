import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CategoryGroup } from '../category-group/category-group.entity';

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
}
