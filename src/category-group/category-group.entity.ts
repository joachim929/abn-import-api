import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Category } from '../category/category.entity';

@Entity()
export class CategoryGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // todo ManyToOne
  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

  @OneToMany(type => Category, category => category.categoryGroup)
  categories: Category[];
}
