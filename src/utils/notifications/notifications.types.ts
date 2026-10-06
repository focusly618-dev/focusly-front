export type SoundType =
  | 'taskUpcoming'
  | 'sessionStart'
  | 'breakReminder'
  | 'sessionEnd';

export interface SoundOptions {
  volume?: number;
  duration?: number;
}
