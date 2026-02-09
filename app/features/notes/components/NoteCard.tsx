import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { Note } from '../NoteTypes.ts';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Colors from '../../../styles/colors.ts';
import Fonts from '../../../styles/Fonts.tsx';
import Icon from '../../../components/icon/Icon.tsx';
import IconButton from '../../../components/iconButton/IconButton.tsx';
import { getRelativeTime } from '../../../utils/functions.ts';
import { useNotes } from '../../../providers/NotesContext.tsx';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  setNoteToDelete: (id: string) => void;
}

const NoteCard = ({ note, onPress, setNoteToDelete }: NoteCardProps) => {
  //TODO: Split the delete view in 2, with either an animated diagonal slash or a linear gradient. One view for delete and one view for setting reminder
  const { pinNote, unpinNote } = useNotes();
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const handlePinPress = () => {
    if (note.isPinned) {
      unpinNote(note.id);
    } else {
      pinNote(note.id);
    }
  };

  const handleLongPress = () => setIsDeleteMode(!isDeleteMode);

  const handleDeletePress = () => setNoteToDelete(note.id);

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={!isDeleteMode ? onPress : () => {}}
        onLongPress={handleLongPress}
        activeOpacity={1}
      >
        {isDeleteMode && (
          <Animated.View
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
            style={styles.deleteView}
          >
            <IconButton
              onPress={handleDeletePress}
              name={'trash'}
              size={25}
              color={Colors.textColor}
            />
          </Animated.View>
        )}
        <View style={styles.topContainer}>
          <TextLabel text={note.title} style={styles.title} />
          <IconButton
            onPress={handlePinPress}
            name={'thumbtack'}
            size={20}
            color={note.isPinned ? Colors.secondary : Colors.secondary}
            iconStyle={!note.isPinned && styles.unpinnedThumbstack}
          />
        </View>
        <View style={styles.lastEdited}>
          <Icon name={'pencil'} size={12} color={Colors.placeholder} />
          <TextLabel
            text={getRelativeTime(note.updatedAt)}
            style={styles.lastEditedText}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  deleteView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: Colors.deleteRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.tabBarBackground,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.textColor,
    marginBottom: 8,
    maxWidth: '85%',
  },
  unpinnedThumbstack: {
    opacity: 0.5,
  },
  lastEdited: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lastEditedText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.placeholder,
  },
});

export default NoteCard;
