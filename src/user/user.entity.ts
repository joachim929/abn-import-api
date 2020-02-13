import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import * as crypto from 'crypto';
import { CategoryGroup } from '../category-group/category-group.entity';
import { Category } from '../category/category.entity';

@Entity()
export class User {

  @PrimaryColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

  @OneToMany(type => CategoryGroup, categoryGroup => categoryGroup.user, {nullable: true})
  categoryGroups: CategoryGroup[];
}
