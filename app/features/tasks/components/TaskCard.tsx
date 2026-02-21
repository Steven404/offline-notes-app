import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Task } from '../TaskTypes.tsx';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Fonts from '../../../styles/Fonts.tsx';
import IconButton from '../../../components/iconButton/IconButton.tsx';
import { useTasks } from '../../../providers/TasksContext.tsx';
import Icon from '../../../components/icon/Icon.tsx';
import { formatDateTime } from '../../../utils/functions.ts';
import { AnimatedView } from 'react-native-reanimated/src/component/View.ts';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { toggleTaskComplete, updateSubTask } = useTasks();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const animatedViewRef = useRef<AnimatedView>(null);
  const [animatedViewStyles, setAnimatedViewStyles] = useState<ViewStyle[]>([
    styles.cardWrapper,
  ]);

  useEffect(() => {
    // the background colour of the wrapper does not change on theme change without this
    setAnimatedViewStyles([styles.cardWrapper]);
  }, [styles.cardWrapper, theme]);

  const completedSubTasks = task.subTasks.filter(st => st.completed).length;
  const totalSubTasks = task.subTasks.length;
  const hasSubTasks = totalSubTasks > 0;

  const hasActiveReminder =
    task.reminder && task.reminder.time > Date.now() && !task.completed;

  const handleToggleExpand = () => {
    if (hasSubTasks) {
      setIsCollapsed(!isCollapsed);
    }
  };

  useEffect(() => {
    if (!isCollapsed) {
      setAnimatedViewStyles([
        styles.cardWrapper,
        hasActiveReminder
          ? styles.cardWrapperPaddingVerticalWithReminder
          : styles.cardWrapperPaddingVertical,
      ]);
    } else {
      // Removing this timeout makes the collapse animation junky/note smooth
      setTimeout(() => {
        setAnimatedViewStyles([styles.cardWrapper]);
      }, 300);
    }
  }, [isCollapsed]);

  return (
    <Animated.View
      ref={animatedViewRef}
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      style={animatedViewStyles}
    >
      <View style={styles.mainRow}>
        <IconButton
          onPress={() => toggleTaskComplete(task.id)}
          name={task.completed ? 'square-check' : 'square'}
          size={24}
          color={task.completed ? theme.primary : theme.darkerBackground}
          iconStyle={styles.checkbox}
        />
        <TouchableOpacity onPress={onEdit} style={styles.titleTouchableOpacity}>
          <TextLabel
            text={task.title}
            style={[styles.title, task.completed && styles.completedText]}
          />
          {hasActiveReminder && (
            <View style={styles.reminderContainer}>
              <Icon name="bell" size={12} color={theme.secondary} />
              <TextLabel
                text={formatDateTime(task.reminder!.time)}
                style={styles.reminderText}
              />
            </View>
          )}
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
              color={theme.placeholder}
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
                  subTask.completed ? theme.primary : theme.darkerBackground
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

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    cardWrapper: {
      backgroundColor: theme.tabBarBackground,
      paddingHorizontal: 16,
      justifyContent: 'center',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 12,
      minHeight: 60,
    },
    cardWrapperPaddingVertical: {
      paddingVertical: 18,
    },
    cardWrapperPaddingVerticalWithReminder: {
      paddingVertical: 11,
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
      lineHeight: 16,
      fontFamily: Fonts.MontserratMedium,
      color: theme.textColor,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: theme.placeholder,
    },
    reminderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      gap: 4,
    },
    reminderText: {
      fontSize: 12,
      fontFamily: Fonts.MontserratRegular,
      color: theme.secondary,
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    subTaskCount: {
      fontSize: 14,
      fontFamily: Fonts.MontserratRegular,
      color: theme.placeholder,
    },
    subTasksContainer: {
      paddingLeft: 16,
      paddingTop: 16,
      borderTopWidth: 0.5,
      borderTopColor: theme.placeholder + '40',
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
      color: theme.textColor,
    },
  });

export default TaskCard;
