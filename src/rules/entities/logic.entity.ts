import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransferCondition } from './transfer-condition.entity';
import { LogicValue } from './logic-value.entity';
import { TransferKeyEnum } from '../interfaces/transfer-key.enum';
import { ConditionOperatorEnum } from '../interfaces/condition-operator.enum';

@Entity()
export class Logic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;

  @Column()
  transferKey: TransferKeyEnum;

  @ManyToOne(() => TransferCondition, rule => rule.andLogic, {cascade: ['insert'], onDelete: 'CASCADE'})
  andCondition: TransferCondition;

  @ManyToOne(() => TransferCondition, rule => rule.orLogic, {cascade: ['insert'], onDelete: 'CASCADE'})
  orCondition: TransferCondition;

  @OneToMany(() => LogicValue, logicValue => logicValue.logic, {cascade: ['insert', 'update'], onDelete: 'CASCADE'})
  values: LogicValue[];

  @Column()
  conditionOperator: ConditionOperatorEnum;

  /**
   * Used to track performance, to save on time, can break on the hardest on auto-complete
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
