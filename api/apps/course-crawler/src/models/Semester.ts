export class SemesterData {
  readonly year: number;
  readonly season: string;

  constructor({ year, season }: { year: number; season: string }) {
    this.year = year;
    this.season = season;
  }
}
