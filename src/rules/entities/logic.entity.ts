import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rule } from './rules.entity';

@Entity()
export class Logic {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({nullable: true})
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

  @ManyToOne(() => Rule, rule => rule.andLogic, {onDelete: 'CASCADE'})
  andRule: Rule;

  @ManyToOne(() => Rule, rule => rule.orLogic, {onDelete: 'CASCADE'})
  orRule: Rule;

  /**
   * Used to track preformance, to save on time, can break on the hardest on auto-complete
   */
  @Column({default: 0})
  passDifficulty: number;

  /**
   * Used to calculate passDifficulty
   */
  @Column({default: 0})
  amountUsed: number;

  /**
   * Used to calculate passDifficulty
   */
  @Column({default: 0})
  amountPassed: number;

  /**
   * todo:
   *  And relationship self referencing
   *  OR relationship self referencing
   *  Rule relationship
   *  Logic (needs to be an enum)
   *  Values (needs to be an array)
   */
}
