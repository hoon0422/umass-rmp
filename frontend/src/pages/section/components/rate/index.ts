export { default } from './RateContainer';

export interface RateForm {
  id: number;
  overallScore: number;
  easyness: number;
  learned: number;
  teaching: number;
  rate: string;
}
