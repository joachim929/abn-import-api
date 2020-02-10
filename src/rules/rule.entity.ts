import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  categoryId: number;

  @Column()
  autoAssign: boolean;
}
