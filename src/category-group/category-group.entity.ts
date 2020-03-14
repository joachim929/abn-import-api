import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, JoinColumn, ManyToOne,
} from 'typeorm';
import { Category } from '../category/category.entity';

@Entity()
export class CategoryGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: number;

  @Column({nullable: true})
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

  @OneToMany(type => Category, category => category.categoryGroup)
  categories: Category[];
}
