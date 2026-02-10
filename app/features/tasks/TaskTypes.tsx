import { Reminder } from '../../utils/types.ts';

interface TaskCore {
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  reminder?: Reminder;
  subTasks: TaskCore[];
  createdAt: number;
  updatedAt: number;
}
