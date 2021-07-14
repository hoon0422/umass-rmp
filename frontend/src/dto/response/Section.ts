import { ClassCategory } from './ClassCategory';
import { Course } from './Course';
import { Location } from './Location';
import { Professor } from './Professor';
import { SectionTime } from './SectionTime';

export class SearchedSection {
  id: number;
  category: ClassCategory;
  classNumber: string;
  course: Course;
  professors: Professor[];
}

export class SectionDescription {
  id: number;
  category: ClassCategory;
  components: ClassCategory[];
  classNumber: string;
  course: Course;
  professors: Professor[];
  location: Location;
  sectionTimes: SectionTime[];
  minUnit: number;
  maxUnit: number;
  online: boolean;
}
