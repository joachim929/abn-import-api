import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransferCondition } from './transfer-condition.entity';
import { TransferKeyEnum } from '../interfaces/transfer-key.enum';
import { ConditionOperatorEnum } from '../interfaces/condition-operator.enum';
import { LogicTypeEnum } from '../interfaces/logic-type.enum';

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

  @ManyToOne(() => TransferCondition, rule => rule.andLogic, {cascade: ['insert', 'update'], onDelete: 'CASCADE'})
  andCondition: TransferCondition;

  @ManyToOne(() => TransferCondition, rule => rule.orLogic, {cascade: ['insert', 'update'], onDelete: 'CASCADE'})
  orCondition: TransferCondition;

  @Column()
  value: string;

  @Column()
  conditionOperator: ConditionOperatorEnum;

  @Column()
  type: LogicTypeEnum;

  /**
   * Used to track performance, to save on time, can break on the hardest on auto-complete
   * Nice to have
   */
  @Column({default: 0, nullable: true})
  passDifficulty: number;

  /**
   * Used to calculate passDifficulty
   * Nice to have
   */
  @Column({default: 0, nullable: true})
  amountUsed: number;

  /**
   * Used to calculate passDifficulty
   * Nice to have
   */
  @Column({default: 0, nullable: true})
  amountPassed: number;
}
