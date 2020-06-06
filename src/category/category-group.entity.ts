import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, Index,
} from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class CategoryGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({unique: true})
  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

  @OneToMany(() => Category, category => category.categoryGroup, {onDelete: 'CASCADE'})
  categories: Category[];
}
