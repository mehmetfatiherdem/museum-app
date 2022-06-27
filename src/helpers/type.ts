export const DAY_NAMES = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type DayNames = typeof DAY_NAMES[number];

export type WorkingTimes = {
    [key in DayNames]: {
      opening: string;
      closing: string;
    } | null;
  };