import React, { forwardRef, useMemo } from 'react';
import {
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import Checkbox from '../../../components/checkbox/Checkbox.tsx';
import { typeStyle } from '../../../styles/typography.ts';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';

interface SubTaskItemProps {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  onRemove: () => void;
}

const SubTaskItem = forwardRef<TextInput, SubTaskItemProps>(
  (
    { title, completed, onToggle, onChangeText, onSubmitEditing, onRemove },
    ref,
  ) => {
    const { theme } = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);

    const handleKeyPress = ({
      nativeEvent,
    }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (nativeEvent.key === 'Backspace' && title === '') {
        onRemove();
      }
    };

    return (
      <Animated.View
        layout={LinearTransition}
        entering={FadeInUp.duration(200)}
        exiting={FadeOutDown.duration(200)}
        style={styles.subTaskContainer}
      >
        <Checkbox
          checked={completed}
          onToggle={onToggle}
          label={title || 'Subtask'}
          size="sm"
          style={styles.checkbox}
        />
        <TextInput
          ref={ref}
          style={[
            styles.subTaskInput,
            completed && styles.subTaskInputCompleted,
          ]}
          placeholder="Add subtask..."
          accessibilityLabel="Subtask"
          placeholderTextColor={theme.placeholder}
          value={title}
          onChangeText={onChangeText}
          autoFocus={true}
          onSubmitEditing={onSubmitEditing}
          onKeyPress={handleKeyPress}
          enterKeyHint={'next'}
          blurOnSubmit={false}
        />
      </Animated.View>
    );
  },
);

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    subTaskContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingLeft: 2,
    },
    checkbox: {
      marginRight: 12,
    },
    subTaskInput: {
      ...typeStyle('preview'),
      flex: 1,
      color: theme.textColor,
      paddingVertical: 6,
    },
    subTaskInputCompleted: {
      textDecorationLine: 'line-through',
      color: theme.placeholder,
    },
  });

export default SubTaskItem;
