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
  id: string;

  @Column({nullable: true})
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

  @ManyToOne(() => TransferCondition, rule => rule.andLogic, {cascade: ['insert'], onDelete: 'CASCADE'})
  andCondition: TransferCondition;

  @ManyToOne(() => TransferCondition, rule => rule.orLogic, {cascade: ['insert'], onDelete: 'CASCADE'})
  orCondition: TransferCondition;

  @OneToMany(() => LogicValue, logicValue => logicValue.logic, {cascade: ['insert'], onDelete: 'CASCADE'})
  values: LogicValue[];

  @Column()
  conditionOperator: ConditionOperatorType;

  /**
   * Used to track preformance, to save on time, can break on the hardest on auto-complete
   * Nice to have
   */
  @Column({default: 0})
  passDifficulty: number;

  /**
   * Used to calculate passDifficulty
   * Nice to have
   */
  @Column({default: 0})
  amountUsed: number;

  /**
   * Used to calculate passDifficulty
   * Nice to have
   */
  @Column({default: 0})
  amountPassed: number;
}
