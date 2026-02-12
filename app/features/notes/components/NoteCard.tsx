import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOut,
  FadeOutRight,
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
  setReminderNote: (note: Note) => void;
}

const NoteCard = ({
  note,
  onPress,
  setNoteToDelete,
  setReminderNote,
}: NoteCardProps) => {
  const { pinNote, unpinNote } = useNotes();
  const [isActionsMode, setIsActionsMode] = useState(false);

  const handlePinPress = () => {
    if (note.isPinned) {
      unpinNote(note.id);
    } else {
      pinNote(note.id);
    }
  };

  const handleLongPress = () => setIsActionsMode(!isActionsMode);

  const handleDeletePress = () => setNoteToDelete(note.id);

  const handleReminderPress = () => {
    setIsActionsMode(false);
    setReminderNote(note);
  };

  const handleBellIconPress = () => {
    if (note.reminder) {
      setReminderNote(note);
    }
  };

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={!isActionsMode ? onPress : () => {}}
        onLongPress={handleLongPress}
        activeOpacity={1}
      >
        {isActionsMode && (
          <Animated.View
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
            style={styles.actionsView}
          >
            <View style={styles.actionButton}>
              <IconButton
                onPress={handleReminderPress}
                name={'bell'}
                size={25}
                color={Colors.textColor}
              />
            </View>
            <View style={[styles.actionButton, styles.deleteActionButton]}>
              <IconButton
                onPress={handleDeletePress}
                name={'trash'}
                size={25}
                color={Colors.textColor}
              />
            </View>
          </Animated.View>
        )}
        <View style={styles.topContainer}>
          <TextLabel text={note.title} style={styles.title} />
          <View style={styles.iconContainer}>
            <IconButton
              onPress={handlePinPress}
              name={'thumbtack'}
              size={20}
              color={Colors.primary}
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
          {note.reminder && note.reminder.time > Date.now() && (
            <Animated.View
              exiting={FadeOutRight.duration(300)}
              entering={FadeInRight.duration(300)}
            >
              <IconButton
                name="bell"
                size={20}
                color={Colors.secondary}
                onPress={handleBellIconPress}
              />
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const contentStyle: MixedStyleDeclaration = {
  fontSize: 16,
  fontFamily: Fonts.MontserratRegular,
  color: Colors.placeholder,
  maxHeight: 19.3, // This is needed in case the user hits enter and creates new line manually in the note
  overflow: 'hidden',
};

const styles = StyleSheet.create({
  actionsView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
  },
  deleteActionButton: {
    backgroundColor: Colors.deleteRed,
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
    justifyContent: 'space-between',
  },
  lastEditedText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.placeholder,
  },
});

export default NoteCard;
