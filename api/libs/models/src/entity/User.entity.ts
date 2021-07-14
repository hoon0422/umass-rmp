import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Major } from './Major.entity';
import { Rate } from './Rate.entity';

export enum UserLevel {
  NotVerified = 0,
  Rateable = 1,
  FullAccess = 2,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 20 })
  username: string;

  @Column('text')
  password: string;

  @Column('varchar', { length: 20 })
  nickname: string;

  @Column('text')
  email: string;

  @ManyToOne(() => Major, { eager: true })
  major: Major;

  @Column({
    type: 'enum',
    enum: UserLevel,
    default: UserLevel.NotVerified,
  })
  level: UserLevel;

  @OneToMany(() => Rate, (rate) => rate.user)
  rates: Rate[];
}
