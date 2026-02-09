import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { Note } from '../utils/NoteTypes.ts';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Colors from '../../../styles/colors.ts';
import Fonts from '../../../styles/Fonts.tsx';
import IconButton from '../../../components/iconButton/IconButton.tsx';
import { formatDateTime } from '../../../utils/functions.ts';
import { useNotes } from '../../../providers/NotesContext.tsx';
import RenderHTML, { MixedStyleDeclaration } from 'react-native-render-html';

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
          <View style={styles.iconContainer}>
            <IconButton
              onPress={handlePinPress}
              name={'thumbtack'}
              size={20}
              color={note.isPinned ? Colors.secondary : Colors.secondary}
              iconStyle={!note.isPinned && styles.unpinnedThumbstack}
            />
          </View>
        </View>
        <View>
          <RenderHTML
            source={{ html: note.content }}
            baseStyle={contentStyle}
            defaultTextProps={{
              numberOfLines: 1,
              ellipsizeMode: 'tail',
            }}
          />
        </View>
        <View style={styles.lastEdited}>
          <TextLabel
            text={formatDateTime(note.updatedAt)}
            style={styles.lastEditedText}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const contentStyle: MixedStyleDeclaration = {
  fontSize: 16,
  fontFamily: Fonts.MontserratRegular,
  color: Colors.placeholder,
  maxWidth: '85%',
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
    gap: 4,
    backgroundColor: Colors.tabBarBackground,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: 30,
  },
  title: {
    fontSize: 18,
    lineHeight: 20,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.textColor,
    maxWidth: '85%',
  },
  iconContainer: { maxHeight: 20 },
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
