import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../../components/backButton/BackButton.tsx';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigation.tsx';
import { useNotes } from '../../../providers/NotesContext.tsx';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';

type NoteProps = StackScreenProps<RootStackParamList, 'note'>;

const Note = ({ route }: NoteProps) => {
  const { noteId } = route.params;
  const { notes } = useNotes();

  const note = notes.find(n => n.id === noteId)!;

  return (
    <SafeAreaView style={styles.pageWrapper}>
      <View style={styles.header}>
        <BackButton />
      </View>
      <ScrollView>
        <TextLabel text={note?.title} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {},
});

export default Note;
