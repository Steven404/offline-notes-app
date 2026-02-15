import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../../styles/colors.ts';
import { useTasks } from '../../../providers/TasksContext.tsx';
import Animated, { LinearTransition } from 'react-native-reanimated';
import SubTaskItem from './SubTaskItem.tsx';

import { Task } from '../TaskTypes.tsx';

interface TaskModalProps {
  isVisible: boolean;
  onClose: () => void;
  taskToEdit?: Task;
}

interface SubTaskDraft {
  title: string;
  completed: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isVisible,
  onClose,
  taskToEdit,
}) => {
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
      };

      if (taskToEdit) {
        updateTask(taskToEdit.id, taskData);
      } else {
        addTask(taskData);
      }
      handleClose();
    }
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

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      backdropOpacity={0.5}
      style={styles.modal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Animated.View layout={LinearTransition} style={styles.modalContent}>
          <TextInput
            ref={titleRef}
            style={[styles.input, taskCompleted && styles.completedText]}
            placeholder="Press enter to create subtasks"
            placeholderTextColor={Colors.placeholder}
            value={taskTitle}
            onChangeText={setTaskTitle}
            onSubmitEditing={() => {
              if (taskTitle.trim()) {
                addSubTaskField();
              }
            }}
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
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                !taskTitle.trim() && styles.saveButtonDisabled,
              ]}
              onPress={handleSaveTask}
              disabled={!taskTitle.trim()}
            >
              <Text style={styles.saveButtonText}>
                {taskToEdit ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: Colors.background,
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
    fontSize: 18,
    color: Colors.textColor,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    paddingVertical: 10,
    marginBottom: 10,
    fontFamily: 'Montserrat-Regular',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.placeholder,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: Colors.placeholder,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.placeholder,
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});

export default TaskModal;
