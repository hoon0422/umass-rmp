import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { Major } from './Major.entity';
import { Section } from './Section.entity';
import { Semester } from './Semester.entity';

@Unique(['courseNumber', 'semester'])
@Entity({
  orderBy: {
    semester: 'DESC',
    courseNumber: 'ASC',
  },
})
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', { length: 20 })
  courseNumber: string;

  @ManyToOne(() => Semester, { eager: true })
  semester: Semester;

  @ManyToOne(() => Major, { eager: true })
  major: Major;

  @OneToMany(() => Section, (section) => section.course)
  sections: Section[];
}
