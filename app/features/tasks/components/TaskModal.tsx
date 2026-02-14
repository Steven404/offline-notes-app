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
import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import Icon from '../../../components/icon/Icon.tsx';

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
            autoFocus={true}
            onSubmitEditing={() => {
              if (taskTitle.trim()) {
                addSubTaskField();
              }
            }}
            blurOnSubmit={false}
          />

          {subTasks.map((subTask, index) => (
            <Animated.View
              key={index}
              layout={LinearTransition}
              entering={FadeInUp.duration(200)}
              exiting={FadeOutDown.duration(200)}
              style={styles.subTaskContainer}
            >
              <TouchableOpacity
                onPress={() => toggleSubTask(index)}
                style={styles.checkbox}
              >
                <Icon
                  name={
                    subTask.completed
                      ? ['fas', 'check-square']
                      : ['far', 'square']
                  }
                  size={20}
                  color={
                    subTask.completed ? Colors.primary : Colors.placeholder
                  }
                />
              </TouchableOpacity>
              <TextInput
                //@ts-ignore
                ref={el => (subTaskRefs.current[index] = el)}
                style={[
                  styles.subTaskInput,
                  subTask.completed && styles.subTaskInputCompleted,
                ]}
                placeholder="Add subtask..."
                placeholderTextColor={Colors.placeholder}
                value={subTask.title}
                onChangeText={text => updateSubTaskTitle(index, text)}
                autoFocus={true}
                onSubmitEditing={() => {
                  if (subTasks[index].title) {
                    addSubTaskField();
                  }
                }}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && subTask.title === '') {
                    removeSubTaskField(index);
                  }
                }}
                blurOnSubmit={false}
              />
            </Animated.View>
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
                {taskToEdit ? 'Update Task' : 'Add Task'}
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
  subTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingLeft: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  subTaskInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textColor,
    fontFamily: 'Montserrat-Regular',
    paddingVertical: 5,
  },
  subTaskInputCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.placeholder,
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
