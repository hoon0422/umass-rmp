import { Major } from './Major';
import { Semester } from './Semester';

export interface Course {
  id: number;
  title: string;
  courseNumber: string;
  semester: Semester;
  major: Major;
}
