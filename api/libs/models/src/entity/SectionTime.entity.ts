import { Entity, PrimaryColumn } from 'typeorm';

// export type Weekday = 'Mo'| 'Tu'| 'We'| 'Th'| 'Fr'| 'Sa'| 'Su'

export enum Weekday {
  Monday = 'Mo',
  Tuesday = 'Tu',
  Wednesday = 'We',
  Thursday = 'Th',
  Friday = 'Fr',
  Saturday = 'Sa',
  Sunday = 'Su',
}

@Entity()
export class SectionTime {
  @PrimaryColumn({
    type: 'enum',
    enum: Weekday,
    enumName: 'Weekday',
  })
  weekday: Weekday;

  @PrimaryColumn('smallint')
  startHour: number;

  @PrimaryColumn('smallint')
  startMinute: number;

  @PrimaryColumn('smallint')
  endHour: number;

  @PrimaryColumn('smallint')
  endMinute: number;
}
