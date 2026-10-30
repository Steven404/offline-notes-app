import React, { useMemo, useState } from 'react';
import {
  AccessibilityActionEvent,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOut,
  FadeOutRight,
  LinearTransition,
} from 'react-native-reanimated';
import { Note } from '../utils/NoteTypes.ts';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import HighlightedText from '../../../components/highlightedText/HighlightedText.tsx';
import Fonts from '../../../styles/Fonts.tsx';
import IconButton from '../../../components/iconButton/IconButton.tsx';
import { formatDateTime } from '../../../utils/functions.ts';
import { stripHtmlTags } from '../../../utils/reminders.ts';
import { useNotes } from '../../../providers/NotesContext.tsx';
import RenderHTML, {
  defaultSystemFonts,
  MixedStyleDeclaration,
} from 'react-native-render-html';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';
import { typeStyle } from '../../../styles/typography.ts';

// RenderHTML drops any fontFamily it hasn't been told about
const HTML_FONTS = [...defaultSystemFonts, Fonts.LiterataRegular];

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  setNoteToDelete: (id: string) => void;
  setReminderNote: (note: Note) => void;
  searchTerm?: string;
}

const NoteCard = ({
  note,
  onPress,
  setNoteToDelete,
  setReminderNote,
  searchTerm,
}: NoteCardProps) => {
  const { pinNote, unpinNote } = useNotes();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
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

  const hasActiveReminder = Boolean(
    note.reminder && note.reminder.time > Date.now(),
  );

  // The card is a single VoiceOver element, so its inner buttons are exposed
  // as custom actions (swipe up/down on iOS, actions menu on Android).
  const accessibilityLabel = [
    note.isPinned ? `Pinned. ${note.title}` : note.title,
    stripHtmlTags(note.content).trim(),
    `Edited ${formatDateTime(note.updatedAt)}`,
    hasActiveReminder
      ? `Reminder ${formatDateTime(note.reminder!.time)}`
      : undefined,
  ]
    .filter(Boolean)
    .join('. ');

  const accessibilityActions = [
    { name: 'activate', label: 'Open note' },
    { name: 'togglePin', label: note.isPinned ? 'Unpin' : 'Pin' },
    {
      name: 'reminder',
      label: hasActiveReminder ? 'Edit reminder' : 'Set reminder',
    },
    { name: 'delete', label: 'Delete' },
  ];

  const handleAccessibilityAction = (event: AccessibilityActionEvent) => {
    switch (event.nativeEvent.actionName) {
      case 'activate':
        onPress();
        break;
      case 'togglePin':
        handlePinPress();
        break;
      case 'reminder':
        handleReminderPress();
        break;
      case 'delete':
        handleDeletePress();
        break;
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
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityActions={accessibilityActions}
        onAccessibilityAction={handleAccessibilityAction}
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
                label={hasActiveReminder ? 'Edit reminder' : 'Set reminder'}
                name={'bell'}
                size={25}
                color={theme.onSecondary}
              />
            </View>
            <View style={[styles.actionButton, styles.deleteActionButton]}>
              <IconButton
                onPress={handleDeletePress}
                label="Delete note"
                name={'trash'}
                size={25}
                color={theme.onDanger}
              />
            </View>
          </Animated.View>
        )}
        <View style={styles.topContainer}>
          <HighlightedText
            text={note.title}
            searchTerm={searchTerm}
            style={styles.title}
            highlightStyle={styles.titleHighlight}
          />
          <View style={styles.iconContainer}>
            <IconButton
              onPress={handlePinPress}
              label={note.isPinned ? 'Unpin note' : 'Pin note'}
              accessibilityState={{ selected: note.isPinned }}
              name={'thumbtack'}
              size={20}
              color={note.isPinned ? theme.primary : theme.placeholder}
            />
          </View>
        </View>
        <View>
          <RenderHTML
            contentWidth={width}
            source={{ html: note.content }}
            baseStyle={contentStyle}
            systemFonts={HTML_FONTS}
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
          {hasActiveReminder && (
            <Animated.View
              exiting={FadeOutRight.duration(300)}
              entering={FadeInRight.duration(300)}
              style={styles.iconContainer}
            >
              <IconButton
                label="Edit reminder"
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
  fontFamily: Fonts.LiterataRegular,
  fontSize: 15,
  lineHeight: 22,
  color: theme.placeholder,
  maxHeight: 22, // One line, even when the note starts with manual line breaks
  overflow: 'hidden',
  width: '90%',
});

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    titleHighlight: {
      color: theme.onPrimary,
      backgroundColor: theme.primary,
    },
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
      backgroundColor: theme.deleteRedFill,
    },
    container: {
      gap: 6,
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
      ...typeStyle('itemTitle'),
      color: theme.textColor,
      maxWidth: '85%',
    },
    iconContainer: { maxHeight: 15 },
    lastEdited: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    lastEditedText: {
      ...typeStyle('meta'),
      color: theme.placeholder,
    },
  });

export default NoteCard;
