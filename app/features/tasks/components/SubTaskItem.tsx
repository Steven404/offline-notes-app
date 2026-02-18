import React, { forwardRef, useMemo } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import Icon from '../../../components/icon/Icon.tsx';
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
        <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
          <Icon
            name={completed ? ['fas', 'check-square'] : ['far', 'square']}
            size={20}
            color={completed ? theme.primary : theme.placeholder}
          />
        </TouchableOpacity>
        <TextInput
          ref={ref}
          style={[
            styles.subTaskInput,
            completed && styles.subTaskInputCompleted,
          ]}
          placeholder="Add subtask..."
          placeholderTextColor={theme.placeholder}
          value={title}
          onChangeText={onChangeText}
          autoFocus={true}
          onSubmitEditing={onSubmitEditing}
          onKeyPress={handleKeyPress}
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
      paddingVertical: 5,
      paddingLeft: 10,
    },
    checkbox: {
      marginRight: 10,
    },
    subTaskInput: {
      flex: 1,
      fontSize: 16,
      color: theme.textColor,
      fontFamily: 'Montserrat-Regular',
      paddingVertical: 5,
    },
    subTaskInputCompleted: {
      textDecorationLine: 'line-through',
      color: theme.placeholder,
    },
  });

export default SubTaskItem;
