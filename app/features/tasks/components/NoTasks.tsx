import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Fonts from '../../../styles/Fonts.tsx';
import AddTasks from '../../../assets/svg/add_tasks.svg';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';

const NoTasks = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Animated.View
      entering={FadeIn.delay(500).duration(500)}
      exiting={FadeOut.duration(500)}
      style={styles.noTasksContainer}
    >
      <AddTasks width={250} height={250} />
      <TextLabel text={'No tasks added yet!'} style={styles.noTasksText} />
    </Animated.View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    noTasksContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noTasksText: {
      marginTop: 20,
      fontFamily: Fonts.MontserratRegular,
      fontSize: 16,
      color: theme.textColor,
    },
  });

export default NoTasks;
