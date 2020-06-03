import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransferCondition } from './transfer-condition.entity';
import { ConditionOperatorType } from '../interfaces/condition-operator.type';
import { LogicValue } from './logic-value.entity';

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

  @ManyToOne(() => TransferCondition, rule => rule.andLogic, {onDelete: 'CASCADE'})
  andConditions: TransferCondition;

  @ManyToOne(() => TransferCondition, rule => rule.orLogic, {onDelete: 'CASCADE'})
  orConditions: TransferCondition;

  @OneToMany(() => LogicValue, logicValue => logicValue.logic, {onDelete: 'CASCADE'})
  values: LogicValue[];

  @Column()
  conditionOperator: ConditionOperatorType;

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
