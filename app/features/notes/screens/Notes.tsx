import { StyleSheet, View, FlatList } from 'react-native';
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

const NoNotes = () => {
  return (
    <TextLabel
      text={'No notes yet'}
      style={{ fontFamily: Fonts.MontserratRegular }}
    />
  );
};

//TODO: Instead of navigating the user directly to the note editor, add a Note.tsx component for displaying the note only. In there add an edit note button

const Notes = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { notes, isLoading } = useNotes();

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

  return (
    <View style={styles.pageWrapper}>
      <View style={styles.header}>
        <TextLabel text={'Notes'} style={styles.headerText} />
      </View>
      {isLoading ? <SimpleLoading centered /> : pageContent}
      <AddNoteButton
        onPress={() => navigation.navigate('noteEditor', { noteId: undefined })}
      />
      <DeleteNoteModal
        isVisible={Boolean(noteToDelete)}
        onClose={() => setNoteToDelete(null)}
        onConfirm={() => {
          // Logic will be added here later
        }}
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
  header: {
    width: '100%',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 36,
    fontFamily: Fonts.MontserratSemiBold,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default Notes;
