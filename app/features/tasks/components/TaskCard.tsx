import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Task } from '../TaskTypes.tsx';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Checkbox from '../../../components/checkbox/Checkbox.tsx';
import { typeStyle } from '../../../styles/typography.ts';
import { useTasks } from '../../../providers/TasksContext.tsx';
import Icon from '../../../components/icon/Icon.tsx';
import { formatDateTime } from '../../../utils/functions.ts';
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

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      style={styles.cardWrapper}
    >
      <View style={styles.mainRow}>
        <Checkbox
          checked={task.completed}
          onToggle={() => toggleTaskComplete(task.id)}
          label={task.title}
          style={styles.checkbox}
        />
        <TouchableOpacity
          onPress={onEdit}
          style={styles.titleTouchableOpacity}
          accessibilityRole="button"
          accessibilityHint="Opens the task editor"
        >
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
            accessibilityRole="button"
            accessibilityLabel={`Subtasks, ${completedSubTasks} of ${totalSubTasks} done`}
            accessibilityState={{ expanded: !isCollapsed }}
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
              <Checkbox
                checked={subTask.completed}
                onToggle={() =>
                  updateSubTask(task.id, index, !subTask.completed)
                }
                label={subTask.title}
                size="sm"
                style={styles.subCheckbox}
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
    // One padding for every state: the main row is at least 44pt (the
    // subtask toggle's touch target), so collapsed cards come out 60pt tall
    // and expanding only adds the subtask list below, never above.
    cardWrapper: {
      backgroundColor: theme.tabBarBackground,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 12,
    },
    mainRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 44,
    },
    checkbox: {
      marginRight: 14,
    },
    titleTouchableOpacity: {
      flex: 1,
    },
    // Task titles are the user's words, so they take the serif. Body size,
    // tighter leading: these are single list lines, not paragraphs.
    title: {
      ...typeStyle('body'),
      lineHeight: 23,
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
      ...typeStyle('meta'),
      color: theme.secondary,
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minHeight: 44,
      paddingLeft: 12,
    },
    subTaskCount: {
      ...typeStyle('meta'),
      color: theme.placeholder,
      fontVariant: ['tabular-nums'],
    },
    // The 44pt main row already centers its text with ~10pt to spare, so the
    // divider sits close; paddingBottom + the card's 8pt match the ~18pt
    // above the title text.
    subTasksContainer: {
      paddingLeft: 16,
      paddingTop: 14,
      paddingBottom: 10,
      gap: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.placeholder + '40',
      marginTop: 4,
    },
    subTaskRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    subCheckbox: {
      marginRight: 12,
    },
    subTaskTitle: {
      ...typeStyle('preview'),
      color: theme.textColor,
    },
  });

export default TaskCard;
