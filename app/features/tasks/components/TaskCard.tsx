import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Task } from '../TaskTypes.tsx';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Colors from '../../../styles/colors.ts';
import Fonts from '../../../styles/Fonts.tsx';
import IconButton from '../../../components/iconButton/IconButton.tsx';
import { useTasks } from '../../../providers/TasksContext.tsx';
import Icon from '../../../components/icon/Icon.tsx';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { toggleTaskComplete, updateSubTask } = useTasks();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const completedSubTasks = task.subTasks.filter(st => st.completed).length;
  const totalSubTasks = task.subTasks.length;
  const hasSubTasks = totalSubTasks > 0;

  const handleToggleExpand = () => {
    if (hasSubTasks) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <Animated.View
      // layout={LinearTransition}
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      style={styles.cardWrapper}
    >
      <View style={styles.mainRow}>
        <IconButton
          onPress={() => toggleTaskComplete(task.id)}
          name={task.completed ? 'square-check' : 'square'}
          size={24}
          color={task.completed ? Colors.primary : Colors.darkerBackground}
          iconStyle={styles.checkbox}
        />
        <TouchableOpacity onPress={onEdit} style={styles.titleTouchableOpacity}>
          <TextLabel
            text={task.title}
            style={[styles.title, task.completed && styles.completedText]}
          />
        </TouchableOpacity>
        {hasSubTasks && (
          <TouchableOpacity
            onPress={handleToggleExpand}
            style={styles.rightContainer}
            activeOpacity={0.9}
          >
            <TextLabel
              text={`${completedSubTasks}/${totalSubTasks}`}
              style={styles.subTaskCount}
            />
            <Icon
              name={!isCollapsed ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={Colors.placeholder}
            />
          </TouchableOpacity>
        )}
      </View>

      <Collapsible collapsed={isCollapsed}>
        <View style={styles.subTasksContainer}>
          {task.subTasks.map((subTask, index) => (
            <View key={`${task.id}-sub-${index}`} style={styles.subTaskRow}>
              <IconButton
                onPress={() =>
                  updateSubTask(task.id, index, !subTask.completed)
                }
                name={subTask.completed ? 'square-check' : 'square'}
                size={20}
                color={
                  subTask.completed ? Colors.primary : Colors.darkerBackground
                }
                iconStyle={styles.subCheckbox}
              />
              <TextLabel
                text={subTask.title}
                style={[
                  styles.subTaskTitle,
                  subTask.completed && styles.completedText,
                ]}
              />
            </View>
          ))}
        </View>
      </Collapsible>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: Colors.tabBarBackground,
    padding: 16,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 12,
  },
  titleTouchableOpacity: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.textColor,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.placeholder,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subTaskCount: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.placeholder,
  },
  subTasksContainer: {
    paddingLeft: 16,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: Colors.placeholder + '40',
    marginTop: 12,
  },
  subTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subCheckbox: {
    marginRight: 10,
  },
  subTaskTitle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.textColor,
  },
});

export default TaskCard;
