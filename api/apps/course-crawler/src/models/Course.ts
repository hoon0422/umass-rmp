import { SectionData } from './Section';

export class CourseData {
  readonly courseNumber: string;
  readonly title: string;
  readonly sections: SectionData[];

  constructor({
    courseNumber,
    title,
    sections = [],
  }: {
    courseNumber: string;
    title: string;
    sections?: SectionData[];
  }) {
    this.courseNumber = courseNumber;
    this.title = title;
    this.sections = sections;
  }
}
