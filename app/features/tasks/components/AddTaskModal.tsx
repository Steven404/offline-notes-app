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

interface AddTaskModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface SubTaskDraft {
  title: string;
  completed: boolean;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isVisible, onClose }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [subTasks, setSubTasks] = useState<SubTaskDraft[]>([]);
  const { addTask } = useTasks();

  const titleRef = useRef<TextInput>(null);
  const subTaskRefs = useRef<(TextInput | null)[]>([]);

  const handleClose = () => {
    setTaskTitle('');
    setSubTasks([]);
    onClose();
  };

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      addTask({
        title: taskTitle.trim(),
        completed: false,
        subTasks: subTasks.filter(st => st.title.trim() !== ''),
      });
      handleClose();
    }
  };

  const addSubTaskField = () => {
    //Logic behind this: If there are subtasks and are all completed, mark the task as completed on the get go. If there are no subtasks or there are subtasks that are not complete then the task is not complete
    const complete =
      Boolean(subTasks.length) &&
      subTasks.filter(st => !st.completed).length === 0;
    setSubTasks([...subTasks, { title: '', completed: complete }]);
  };

  const removeSubTaskField = (index: number) => {
    const newSubTasks = subTasks.filter((_, i) => i !== index);
    setSubTasks(newSubTasks);

    // Focus previous input
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
    newSubTasks[index].completed = !newSubTasks[index].completed;
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
            style={styles.input}
            placeholder="Press enter to creat subtasks"
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
                styles.addButton,
                !taskTitle.trim() && styles.addButtonDisabled,
              ]}
              onPress={handleAddTask}
              disabled={!taskTitle.trim()}
            >
              <Text style={styles.addButtonText}>Add Task</Text>
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
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: Colors.placeholder,
    opacity: 0.5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});

export default AddTaskModal;
