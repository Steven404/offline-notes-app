import { StyleSheet, View } from 'react-native';
import NoNotes from '../components/NoNotes.tsx';
import Colors from '../../../styles/colors.ts';
import AddNoteButton from '../components/AddNoteButton.tsx';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigation.tsx';
import { useNotes } from '../../../providers/NotesContext.tsx';
import SimpleLoading from '../../../components/simpleLoading/SimpleLoading.tsx';
import NoteCard from '../components/NoteCard.tsx';
import DeleteNoteModal from '../components/DeleteNoteModal.tsx';

import { Note } from '../utils/NoteTypes.ts';
import { useMemo, useState } from 'react';
import BottomBarHeader from '../../../components/bottomBarHeader/BottomBarHeader.tsx';
import SearchNotesScreen from '../components/SearchNotesScreen.tsx';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { sortNotes } from '../utils/noteUtils.ts';

const Notes = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { notes, isLoading, deleteNote, sortBy, showPinnedOnly } = useNotes();
  const [isSearching, setIsSearching] = useState(false);

  const sortedNotes = useMemo(() => {
    return sortNotes(notes, sortBy, showPinnedOnly);
  }, [notes, sortBy, showPinnedOnly]);

  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const renderNote = ({ item }: { item: Note }) => (
    <NoteCard
      setNoteToDelete={setNoteToDelete}
      note={item}
      onPress={() => navigation.navigate('note', { noteId: item.id })}
    />
  );

  const pageContent =
    notes.length > 0 ? (
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
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
      <BottomBarHeader title={'Notes'} onSearchPress={handleSearchPress} />
      {isLoading ? <SimpleLoading centered /> : pageContent}
      <AddNoteButton
        onPress={() => navigation.navigate('noteEditor', { noteId: undefined })}
      />
      <DeleteNoteModal
        isVisible={Boolean(noteToDelete)}
        onClose={() => setNoteToDelete(null)}
        onConfirm={confirmNoteDeletion}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 14,
    zIndex: 1,
  },
  listContent: {
    marginTop: 20,
    paddingBottom: 80,
  },
});

export default Notes;
