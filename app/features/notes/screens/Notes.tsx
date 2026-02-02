import { StyleSheet, View } from 'react-native';
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
import { FlatList } from 'react-native';

import { Note } from '../NoteTypes.ts';

const NoNotes = () => {
  return (
    <TextLabel
      text={'No notes yet'}
      style={{ fontFamily: Fonts.MontserratRegular }}
    />
  );
};

const Notes = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { notes, isLoading } = useNotes();

  const renderNote = ({ item }: { item: Note }) => (
    <NoteCard
      note={item}
      onPress={() => navigation.navigate('noteEditor', { noteId: item.id })}
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
