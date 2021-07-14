import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Section } from './Section.entity';
import { User } from './User.entity';

@Entity()
@Unique(['user', 'section'])
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rates)
  user: User;

  @ManyToOne(() => Section, (section) => section.rates)
  section: Section;

  @Column({
    name: 'overall_score',
    type: 'numeric',
    precision: 1,
    scale: 0,
  })
  overallScore: number;

  @Column({
    type: 'numeric',
    precision: 1,
    scale: 0,
  })
  easyness: number;

  @Column({
    type: 'numeric',
    precision: 1,
    scale: 0,
  })
  learned: number;

  @Column({
    type: 'numeric',
    precision: 1,
    scale: 0,
  })
  teaching: number;

  @Column('text')
  rate: string;

  @Column({
    default: () => 'NOW()',
  })
  modifiedDate: Date;

  @Column({
    default: () => 'NOW()',
  })
  createdDate: Date;
}
