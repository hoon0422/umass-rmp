import { CourseData } from './Course';
import { SemesterData } from './Semester';

export class MajorData {
  readonly name: string;
  readonly value: string;
  readonly semester: SemesterData;
  readonly courses: CourseData[];

  constructor({
    name,
    value,
    semester,
    courses = [],
  }: {
    name: string;
    value: string;
    semester: SemesterData;
    courses: CourseData[];
  }) {
    this.name = name;
    this.value = value;
    this.semester = semester;
    this.courses = courses;
  }
}
