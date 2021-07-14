import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Season {
  Spring = 'Spring',
  Summer = 'Summer',
  Fall = 'Fall',
  Winter = 'Winter',
}

@Entity({
  orderBy: {
    year: 'ASC',
    season: 'DESC',
  },
})
export class Semester {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Column('smallint')
  year: number;

  @Column({ type: 'enum', enum: Season })
  season: Season;
}
