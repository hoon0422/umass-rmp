import { Trim } from 'class-sanitizer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SearchKey {
  @Trim()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(300)
  searchKey: string;

  @IsInt()
  majorId: number;

  @IsString()
  field: 'classNumber' | 'courseNumber' | 'title' | 'professor';
}
