import { Reminder } from '../../../utils/types.ts';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  reminder?: Reminder;
}
