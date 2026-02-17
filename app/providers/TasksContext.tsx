import { Task } from '../features/tasks/TaskTypes.tsx';
import { createContext, useContext, useEffect, useState } from 'react';
import { getDataFromStorage, storeData } from '../utils/asyncStorage.ts';
import uuid from 'react-native-uuid';
import { Reminder } from '../utils/types.ts';
import {
  createReminderNotification,
  removeReminderNotification,
} from '../utils/reminders.ts';
import Consts from '../utils/consts.ts';

const TASKS_STORAGE_KEY = 'tasks';

interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => string;
  deleteTask: (id: string) => void;
  updateTask: (
    id: string,
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  ) => void;
  toggleTaskComplete: (id: string) => void;
  setReminder: (taskId: string, reminder: Reminder) => void;
  removeReminder: (taskId: string) => void;
  addSubTask: (taskId: string, title: string) => void;
  updateSubTask: (
    taskId: string,
    subTaskIndex: number,
    completed: boolean,
  ) => void;
  deleteSubTask: (taskId: string, subTaskIndex: number) => void;
}

const TasksContext = createContext<TasksContextType>({
  tasks: [],
  isLoading: false,
  addTask: () => '',
  deleteTask: () => {},
  updateTask: () => {},
  toggleTaskComplete: () => {},
  setReminder: () => {},
  removeReminder: () => {},
  addSubTask: () => {},
  updateSubTask: () => {},
  deleteSubTask: () => {},
});

export const useTasks = () => useContext(TasksContext);

export const TasksContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await getDataFromStorage(TASKS_STORAGE_KEY);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (e) {
        console.error('Failed to load tasks', e);
      } finally {
        setTimeout(() => setIsLoading(false), 2000);
      }
    };

    loadTasks();
  }, []);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = uuid.v4();
    const now = Date.now();
    const newTask: Task = {
      ...task,
      id,
      createdAt: now,
      updatedAt: now,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    storeData(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
    return id;
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(task => task.id === id)!;
    if (task.reminder) {
      removeReminderNotification(task.id);
    }
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    storeData(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const updateTask = async (
    id: string,
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    let reminder: Reminder | undefined;
    if (task.reminder) {
      const reminderId = await createReminderNotification(
        task.title,
        Consts.taskNotificationBody,
        task.reminder.time,
      );
      reminder = {
        id: reminderId!,
        taskId: id,
        time: task.reminder.time,
      };
      await removeReminderNotification(task.reminder.id);
    }
    const now = Date.now();
    const updatedTasks = tasks.map(t =>
      t.id === id ? { ...t, ...task, updatedAt: now, reminder } : t,
    );

    setTasks(updatedTasks);
    storeData(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const toggleTaskComplete = (id: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const newCompletedStatus = !task.completed;
        return {
          ...task,
          completed: newCompletedStatus,
          subTasks: task.subTasks.map(subTask => ({
            ...subTask,
            completed: newCompletedStatus,
          })),
          updatedAt: Date.now(),
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    storeData(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const setReminder = (taskId: string, reminder: Reminder) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, reminder } : task,
    );
    setTasks(updatedTasks);
    storeData(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const removeReminder = async (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, reminder: undefined } : task,
    );
    setTasks(updatedTasks);
    await storeData(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const addSubTask = (taskId: string, title: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subTasks: [...task.subTasks, { title, completed: false }],
            updatedAt: Date.now(),
          }
        : task,
    );
    setTasks(updatedTasks);
    storeData(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const updateSubTask = (
    taskId: string,
    subTaskIndex: number,
    completed: boolean,
  ) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubTasks = task.subTasks.map((subTask, index) =>
          index === subTaskIndex ? { ...subTask, completed } : subTask,
        );

        let newCompletedStatus = task.completed;
        if (completed) {
          // If subtask is completed, check if all subtasks are now completed
          const allCompleted = updatedSubTasks.every(st => st.completed);
          if (allCompleted) {
            newCompletedStatus = true;
          }
        } else {
          // If subtask is unchecked, the parent task must be unchecked
          newCompletedStatus = false;
        }

        return {
          ...task,
          completed: newCompletedStatus,
          subTasks: updatedSubTasks,
          updatedAt: Date.now(),
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    storeData(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const deleteSubTask = (taskId: string, subTaskIndex: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subTasks: task.subTasks.filter(
              (_, index) => index !== subTaskIndex,
            ),
            updatedAt: Date.now(),
          }
        : task,
    );
    setTasks(updatedTasks);
    storeData(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isLoading,
        addTask,
        deleteTask,
        updateTask,
        toggleTaskComplete,
        setReminder,
        removeReminder,
        addSubTask,
        updateSubTask,
        deleteSubTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
