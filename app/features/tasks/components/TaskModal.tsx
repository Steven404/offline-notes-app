import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { useTasks } from '../../../providers/TasksContext.tsx';
import Animated, { LinearTransition } from 'react-native-reanimated';
import SubTaskItem from './SubTaskItem.tsx';
import IconButton from '../../../components/iconButton/IconButton.tsx';
import Button from '../../../components/button/Button.tsx';
import { typeStyle } from '../../../styles/typography.ts';
import { Reminder } from '../../../utils/types.ts';

import { Task } from '../TaskTypes.tsx';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';

interface TaskModalProps {
  isVisible: boolean;
  onClose: () => void;
  taskToEdit?: Task;
  onOpenReminder: (currentReminder?: Reminder) => void;
  reminder?: Reminder;
  onDelete?: () => void;
}

interface SubTaskDraft {
  title: string;
  completed: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isVisible,
  onClose,
  taskToEdit,
  onOpenReminder,
  reminder,
  onDelete,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [subTasks, setSubTasks] = useState<SubTaskDraft[]>([]);
  const { addTask, updateTask } = useTasks();

  const titleRef = useRef<TextInput>(null);
  const subTaskRefs = useRef<(TextInput | null)[]>([]);

  React.useEffect(() => {
    if (isVisible) {
      if (taskToEdit) {
        setTaskTitle(taskToEdit.title);
        setTaskCompleted(taskToEdit.completed);
        setSubTasks(taskToEdit.subTasks.map(st => ({ ...st })));
      } else {
        setTaskTitle('');
        setTaskCompleted(false);
        setSubTasks([]);
      }
    }
  }, [isVisible, taskToEdit]);

  const handleClose = () => {
    onClose();
  };

  const handleSaveTask = () => {
    if (taskTitle.trim()) {
      const taskData = {
        title: taskTitle.trim(),
        completed: taskCompleted,
        subTasks: subTasks.filter(st => st.title.trim() !== ''),
        reminder,
      };

      if (taskToEdit) {
        updateTask(taskToEdit.id, taskData);
      } else {
        addTask(taskData);
      }
      handleClose();
    }
  };

  const handleOpenReminderSheet = () => {
    onOpenReminder(reminder);
  };

  const addSubTaskField = () => {
    const complete =
      Boolean(subTasks.length) &&
      subTasks.filter(st => !st.completed).length === 0;
    setSubTasks([...subTasks, { title: '', completed: complete }]);
  };

  const removeSubTaskField = (index: number) => {
    const newSubTasks = subTasks.filter((_, i) => i !== index);
    setSubTasks(newSubTasks);

    if (index === 0) {
      titleRef.current?.focus();
    } else {
      subTaskRefs.current[index - 1]?.focus();
    }
  };

  const updateSubTaskTitle = (index: number, title: string) => {
    const newSubTasks = [...subTasks];
    newSubTasks[index].title = title;
    setSubTasks(newSubTasks);
  };

  const toggleSubTask = (index: number) => {
    const newSubTasks = [...subTasks];
    const newCompletedStatus = !newSubTasks[index].completed;
    newSubTasks[index].completed = newCompletedStatus;

    if (!newCompletedStatus) {
      setTaskCompleted(false);
    } else {
      const allCompleted = newSubTasks.every(st => st.completed);
      if (allCompleted) {
        setTaskCompleted(true);
      }
    }

    setSubTasks(newSubTasks);
  };

  const isReminderInThePast = reminder && reminder.time < Date.now();

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      backdropOpacity={0.5}
      style={styles.modal}
    >
      <KeyboardAvoidingView
        behavior={'padding'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'android' ? 40 : 0}
      >
        <Animated.View layout={LinearTransition} style={styles.modalContent}>
          <TextInput
            ref={titleRef}
            style={[styles.input, taskCompleted && styles.completedText]}
            placeholder="Press enter to create subtasks"
            accessibilityLabel="Task title"
            accessibilityHint="Press return to add a subtask"
            placeholderTextColor={theme.placeholder}
            value={taskTitle}
            onChangeText={setTaskTitle}
            onSubmitEditing={() => {
              if (taskTitle.trim()) {
                addSubTaskField();
              }
            }}
            enterKeyHint={'next'}
            blurOnSubmit={false}
          />

          {subTasks.map((subTask, index) => (
            <SubTaskItem
              key={index}
              ref={el => {
                subTaskRefs.current[index] = el;
              }}
              title={subTask.title}
              completed={subTask.completed}
              onToggle={() => toggleSubTask(index)}
              onChangeText={text => updateSubTaskTitle(index, text)}
              onSubmitEditing={() => {
                if (subTasks[index].title) {
                  addSubTaskField();
                }
              }}
              onRemove={() => removeSubTaskField(index)}
            />
          ))}

          <Animated.View
            layout={LinearTransition}
            style={styles.buttonContainer}
          >
            <View style={styles.leftButtons}>
              <IconButton
                onPress={handleOpenReminderSheet}
                label={
                  reminder && !isReminderInThePast
                    ? 'Edit reminder'
                    : 'Set reminder'
                }
                name="bell"
                size={20}
                color={
                  reminder && !isReminderInThePast
                    ? theme.secondary
                    : theme.placeholder
                }
              />
              {taskToEdit && onDelete && (
                <IconButton
                  onPress={onDelete}
                  label="Delete task"
                  name="trash"
                  size={20}
                  color={theme.deleteRed}
                />
              )}
            </View>
            <View style={styles.rightButtons}>
              <Button label="Cancel" variant="plain" onPress={handleClose} />
              <Button
                label={taskToEdit ? 'Update' : 'Add'}
                onPress={handleSaveTask}
                disabled={!taskTitle.trim()}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    modal: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: 50,
      width: '100%',
      margin: 0,
    },
    keyboardAvoidingView: {
      width: '100%',
    },
    modalContent: {
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    input: {
      ...typeStyle('body'),
      fontSize: 18,
      color: theme.textColor,
      borderBottomWidth: 1,
      borderBottomColor: theme.primary,
      paddingVertical: 10,
      marginBottom: 10,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: theme.placeholder,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    leftButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 24,
    },
    rightButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
  });

export default TaskModal;
