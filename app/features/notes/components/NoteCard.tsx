import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Note } from '../NoteTypes.ts';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Colors from '../../../styles/colors.ts';
import Fonts from '../../../styles/Fonts.tsx';
import Icon from '../../../components/icon/Icon.tsx';
import { getRelativeTime } from '../../../utils/functions.ts';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

const NoteCard = ({ note, onPress }: NoteCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <TextLabel text={note.title} style={styles.title} />
      <View style={styles.lastEdited}>
        <Icon name={'pencil'} size={12} color={Colors.placeholder} />
        <TextLabel
          text={getRelativeTime(note.updatedAt)}
          style={styles.lastEditedText}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.tabBarBackground,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    maxHeight: 100,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.white,
    marginBottom: 8,
  },
  lastEdited: {
    flexDirection: 'row',
    marginTop: 2,
    alignItems: 'center',
    gap: 4,
  },
  lastEditedText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.placeholder,
  },
});

export default NoteCard;
