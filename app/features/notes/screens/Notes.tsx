import { StyleSheet, View, FlatList } from 'react-native';
import NoNotes from '../components/NoNotes.tsx';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Colors from '../../../styles/colors.ts';
import Fonts from '../../../styles/Fonts.tsx';
import AddNoteButton from '../components/AddNoteButton.tsx';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigation.tsx';
import { useNotes } from '../../../providers/NotesContext.tsx';
import SimpleLoading from '../../../components/simpleLoading/SimpleLoading.tsx';
import NoteCard from '../components/NoteCard.tsx';
import DeleteNoteModal from '../components/DeleteNoteModal.tsx';

import { Note } from '../NoteTypes.ts';
import { useState } from 'react';
import BottomBarHeader from '../../../components/bottomBarHeader/BottomBarHeader.tsx';

const Notes = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { notes, isLoading, deleteNote } = useNotes();

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
      <FlatList
        data={notes}
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

  return (
    <View style={styles.pageWrapper}>
      <BottomBarHeader title={'Notes'} />
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
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default Notes;
