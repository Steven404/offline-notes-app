import React from 'react';
import { StyleSheet } from 'react-native';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Colors from '../../../styles/colors.ts';
import Fonts from '../../../styles/Fonts.tsx';
import AddNote from '../../../assets/svg/add_notes.svg';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const NoNotes = () => {
  return (
    <Animated.View
      entering={FadeIn.delay(500).duration(500)}
      exiting={FadeOut.duration(500)}
      style={styles.noNotesContainer}
    >
      <AddNote width={250} height={250} />
      <TextLabel text={'No notes yet'} style={styles.noNotesText} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  noNotesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotesText: {
    marginTop: 20,
    fontFamily: Fonts.MontserratRegular,
    fontSize: 16,
    color: Colors.textColor,
  },
});

export default NoNotes;
