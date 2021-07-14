import { Score } from './Score';
import { User } from './User';

export interface Rate extends Score {
  id: number;
  user: User;
  rate: string;
  modifiedDate?: Date;
  createdDate?: Date;
}
