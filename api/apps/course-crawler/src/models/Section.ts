import { ProfessorData } from './Professor';
import { SectionTimeData } from './SectionTime';

export class SectionData {
  readonly courseNumber: string;
  readonly classNumber: string;
  readonly category: string;
  readonly minUnit: number;
  readonly maxUnit: number;
  readonly components: string[];
  readonly room?: string;
  readonly time: SectionTimeData[];
  readonly professors: ProfessorData[];

  constructor({
    courseNumber,
    classNumber,
    category,
    minUnit = 0,
    maxUnit = 0,
    components,
    room,
    time = [],
    professors = [],
  }: {
    courseNumber: string;
    classNumber: string;
    category: string;
    components: string[];
    minUnit?: number;
    maxUnit?: number;
    room?: string;
    time: SectionTimeData[];
    professors?: ProfessorData[];
  }) {
    this.courseNumber = courseNumber;
    this.classNumber = classNumber;
    this.category = category;
    this.minUnit = minUnit;
    this.maxUnit = maxUnit;
    this.components = components.length !== 0 ? components : [this.category];
    this.room = room !== 'TBA' ? room : undefined;
    this.time = time;
    this.professors = professors;
  }

  get online() {
    return this.room === 'On-Line';
  }
}
