export enum Weekday {
  Monday = 'Mo',
  Tuesday = 'Tu',
  Wednesday = 'We',
  Thursday = 'Th',
  Friday = 'Fr',
  Saturday = 'Sa',
  Sunday = 'Su',
}

export class SectionTime {
  weekday: Weekday;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}
