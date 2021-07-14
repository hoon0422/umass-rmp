export class SectionTimeData {
  readonly weekday: string;
  readonly startHour: number;
  readonly startMinute: number;
  readonly endHour: number;
  readonly endMinute: number;

  constructor({
    weekday,
    startHour,
    startMinute,
    endHour,
    endMinute,
  }: {
    weekday: string;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
  }) {
    this.weekday = weekday;
    this.startHour = startHour;
    this.startMinute = startMinute;
    this.endHour = endHour;
    this.endMinute = endMinute;
  }

  static parseSectionTimeString(sectionTimeStr: string) {
    if (sectionTimeStr === 'TBA') return [];
    try {
      const [weekdays, start, , end] = sectionTimeStr.split(' ');
      const [startHour, startMinuteAndNoon] = start.split(':');
      const startMinute = startMinuteAndNoon.substring(0, 2);
      const startNoon = startMinuteAndNoon.substring(2);
      const [endHour, endMinuteAndNoon] = end.split(':');
      const endMinute = endMinuteAndNoon.substring(0, 2);
      const endNoon = endMinuteAndNoon.substring(2);

      const parsed: SectionTimeData[] = [];

      for (let i = 0; i < weekdays.length; i += 2) {
        parsed.push({
          weekday: weekdays.substring(i, i + 2),
          startHour: parseInt(startHour) + startNoon === 'AM' ? 0 : 12,
          startMinute: parseInt(startMinute),
          endHour: parseInt(endHour) + endNoon === 'AM' ? 0 : 12,
          endMinute: parseInt(endMinute),
        });
      }

      return parsed;
    } catch (e) {
      console.log(sectionTimeStr);
    }
  }
}
