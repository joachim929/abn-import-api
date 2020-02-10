import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class CategoryGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: number;
}
