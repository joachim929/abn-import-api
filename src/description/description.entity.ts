import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AndOr, DescriptionLogic } from './dtos/description.dto';

@Entity()
export class Description {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ruleId: number;

  @Column()
  descriptionSubString: string;

  @Column()
  logic: DescriptionLogic;

  @Column({ nullable: true })
  andOr: AndOr;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  editedAt: Date;
}
