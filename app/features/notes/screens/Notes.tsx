import { StyleSheet, View } from 'react-native';
import NoNotes from '../components/NoNotes.tsx';
import AddItemButton from '../../../components/addItemButton/AddItemButton.tsx';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigation.tsx';
import { useNotes } from '../../../providers/NotesContext.tsx';
import SimpleLoading from '../../../components/simpleLoading/SimpleLoading.tsx';
import NoteCard from '../components/NoteCard.tsx';
import SimpleConfirmModal from '../../../components/simpleConfirmModal/SimpleConfirmModal.tsx';

import { Note } from '../utils/NoteTypes.ts';
import { useEffect, useMemo, useState } from 'react';
import ReminderBottomSheet from '../components/ReminderBottomSheet.tsx';
import BottomBarHeader from '../../../components/bottomBarHeader/BottomBarHeader.tsx';
import SearchNotesScreen from '../components/SearchNotesScreen.tsx';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { sortNotes } from '../utils/noteUtils.ts';
import { stripHtmlTags } from '../../../utils/reminders.ts';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';

const Notes = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const {
    notes,
    isLoading,
    deleteNote,
    sortBy,
    showPinnedOnly,
    setReminder,
    removeReminder,
  } = useNotes();
  const [isSearching, setIsSearching] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 5000); // Refresh every 5 seconds for notification bell in to go away if needed

    return () => clearInterval(interval);
  }, []);

  const sortedNotes = useMemo(() => {
    return sortNotes(notes, sortBy, showPinnedOnly);
  }, [notes, sortBy, showPinnedOnly]);

  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [reminderNote, setReminderNote] = useState<Note | null>(null);

  const renderNote = ({ item }: { item: Note }) => (
    <NoteCard
      setNoteToDelete={setNoteToDelete}
      setReminderNote={setReminderNote}
      note={item}
      onPress={() => navigation.navigate('note', { noteId: item.id })}
    />
  );

  const pageContent =
    notes.length > 0 ? (
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition.delay(500)} //this delay is added to compensate the exiting animation of NotesCard.tsx
        data={sortedNotes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    ) : (
      <NoNotes />
    );

  const confirmNoteDeletion = () => {
    deleteNote(noteToDelete!);
    setNoteToDelete(null);
  };

  const handleSearchPress = () => !isSearching && setIsSearching(true);

  const closeSearchScreen = () => setIsSearching(false);

  return (
    <View style={styles.pageWrapper}>
      {isSearching && (
        <SearchNotesScreen
          onBackButtonPress={closeSearchScreen}
          renderNote={renderNote}
        />
      )}
      <BottomBarHeader
        title={'Notes'}
        onSearchPress={handleSearchPress}
        showFilters={true}
      />
      {isLoading ? <SimpleLoading centered /> : pageContent}
      <AddItemButton
        onPress={() => navigation.navigate('noteEditor', { noteId: undefined })}
      />
      <SimpleConfirmModal
        isVisible={Boolean(noteToDelete)}
        onClose={() => setNoteToDelete(null)}
        onConfirm={confirmNoteDeletion}
        title={'Delete note'}
        text={'Are you sure you want to delete this note?'}
        confirmText={'Delete'}
        cancelText={'Cancel'}
      />
      {reminderNote && (
        <ReminderBottomSheet
          title={reminderNote.title}
          content={stripHtmlTags(reminderNote.content)}
          reminder={reminderNote.reminder}
          isOpen={Boolean(reminderNote)}
          onClose={() => setReminderNote(null)}
          onSave={reminderData => {
            setReminder(reminderNote.id, {
              ...reminderData,
              noteId: reminderNote.id,
            });
          }}
          onRemove={() => {
            removeReminder(reminderNote.id);
          }}
        />
      )}
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    pageWrapper: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 14,
      zIndex: 1,
    },
    listContent: {
      marginTop: 20,
      paddingBottom: 80,
    },
  });

export default Notes;
