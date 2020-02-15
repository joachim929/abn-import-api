import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CategoryGroup } from '../category-group/category-group.entity';

@Entity()
export class User {

  @PrimaryColumn()
  id: number;

  @Column({unique: true})
  userName: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @OneToMany(type => CategoryGroup, categoryGroup => categoryGroup.user, {nullable: true})
  categoryGroups: CategoryGroup[];
}
