export enum Season {
  Spring = 'Spring',
  Summer = 'Summer',
  Fall = 'Fall',
  Winter = 'Winter',
}

export class Semester {
  id: number;
  year: number;
  season: Season;
}
