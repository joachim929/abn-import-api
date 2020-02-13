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
import { User } from '../user/user.entity';

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

  @Column()
  categoryGroupId: number;

  @ManyToOne(type => CategoryGroup)
  @JoinColumn({name: 'categoryGroupId', referencedColumnName: 'id'})
  categoryGroup: CategoryGroup;
}
