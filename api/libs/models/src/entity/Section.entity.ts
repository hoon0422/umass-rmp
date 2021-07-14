import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { ClassCategory } from './ClassCategory.entity';
import { Course } from './Course.entity';
import { Professor } from './Professor.entity';
import { Rate } from './Rate.entity';
import { SectionTime } from './SectionTime.entity';
import { SpireLocation } from './SpireLocation.entity';

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClassCategory)
  category: ClassCategory;

  @ManyToMany(() => ClassCategory)
  @JoinTable()
  components: ClassCategory[];

  @Column('char', { length: 5 })
  classNumber: string;

  @ManyToOne(() => Course, (course) => course.sections)
  course: Course;

  @ManyToMany(() => Professor, { eager: true })
  @JoinTable()
  professors: Professor[];

  @Column({
    type: 'numeric',
    precision: 3,
    scale: 1,
  })
  maxUnits: number;

  @Column({
    type: 'numeric',
    precision: 3,
    scale: 1,
  })
  minUnits: number;

  @ManyToOne(() => SpireLocation, { nullable: true })
  location: SpireLocation;

  @Column('boolean')
  online: boolean;

  @ManyToMany(() => SectionTime, { eager: true })
  @JoinTable()
  sectionTimes: SectionTime[];

  @OneToMany(() => Rate, (rate) => rate.section)
  rates: Rate[];
}
