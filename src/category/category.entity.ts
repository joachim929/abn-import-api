import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { CategoryGroup } from '../category-group/category-group.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

  @ManyToOne(type => CategoryGroup, categoryGroup => categoryGroup.categories)
  categoryGroup: CategoryGroup
}
