import React from 'react';
import { StyleSheet } from 'react-native';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import AddTasks from '../../../assets/svg/add_tasks.svg';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const NoTasks = () => {
  return (
    <Animated.View
      entering={FadeIn.delay(500).duration(500)}
      exiting={FadeOut.duration(500)}
      style={styles.noTasksContainer}
    >
      <AddTasks width={250} height={250} />
      <TextLabel
        text={'No tasks added yet!'}
        variant="heading"
        style={styles.noTasksText}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  noTasksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksText: {
    marginTop: 20,
  },
});

export default NoTasks;
