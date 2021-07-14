export type FieldType = 'classNumber' | 'courseNumber' | 'title' | 'professor';

export class SearchDto {
  searchKey: string;
  majorId: number;
  field: FieldType;
}
