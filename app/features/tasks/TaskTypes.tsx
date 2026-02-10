import { Reminder } from '../../utils/types.ts';

interface SubTask {
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  reminder?: Reminder;
  subTasks: SubTask[];
  createdAt: number;
  updatedAt: number;
}
