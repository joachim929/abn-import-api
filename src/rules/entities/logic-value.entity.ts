import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Logic } from './logic.entity';

@Entity()
export class LogicValue {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Logic, logic => logic.values, {onDelete: 'CASCADE'})
  logic: Logic;

  @Column()
  value: string;
}
