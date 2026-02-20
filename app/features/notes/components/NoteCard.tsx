import React, { useMemo, useState } from 'react';
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
import Fonts from '../../../styles/Fonts.tsx';
import IconButton from '../../../components/iconButton/IconButton.tsx';
import { formatDateTime } from '../../../utils/functions.ts';
import { useNotes } from '../../../providers/NotesContext.tsx';
import RenderHTML, { MixedStyleDeclaration } from 'react-native-render-html';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';

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
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const contentStyle = useMemo(() => makeContentStyle(theme), [theme]);
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
                color={theme.textColor}
              />
            </View>
            <View style={[styles.actionButton, styles.deleteActionButton]}>
              <IconButton
                onPress={handleDeletePress}
                name={'trash'}
                size={25}
                color={theme.textColor}
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
              color={theme.primary}
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
              style={styles.iconContainer}
            >
              <IconButton
                name="bell"
                size={20}
                color={theme.secondary}
                onPress={handleBellIconPress}
              />
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const makeContentStyle = (theme: Theme): MixedStyleDeclaration => ({
  fontSize: 16,
  fontFamily: Fonts.MontserratRegular,
  color: theme.placeholder,
  maxHeight: 20, // This is needed in case the user hits enter and creates new line manually in the note
  overflow: 'hidden',
  width: '90%',
});

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
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
      backgroundColor: theme.secondary,
    },
    deleteActionButton: {
      backgroundColor: theme.deleteRed,
    },
    container: {
      gap: 4,
      backgroundColor: theme.tabBarBackground,
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
      color: theme.textColor,
      maxWidth: '85%',
    },
    iconContainer: { maxHeight: 15 },
    unpinnedThumbstack: {
      opacity: 0.5,
    },
    lastEdited: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    lastEditedText: {
      fontSize: 14,
      fontFamily: Fonts.MontserratRegular,
      color: theme.placeholder,
    },
  });

export default NoteCard;
