import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Amount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ruleId: number;

  @Column()
  logic: 'lessThan' | 'greaterThan' | 'equalTo';

  @Column({ nullable: true })
  andOr: 'and' | 'or';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;
}
