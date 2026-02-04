import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Colors from '../../../styles/colors.ts';
import Icon from '../../../components/icon/Icon.tsx';
import BackButton from '../../../components/backButton/BackButton.tsx';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoteTitleInput from '../components/NoteTitleInput.tsx';
import NoteContentInput from '../components/NoteContentInput.tsx';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useNotes } from '../../../providers/NotesContext.tsx';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigation.tsx';

type NoteEditorProps = StackScreenProps<RootStackParamList, 'noteEditor'>;

const NoteEditor = ({ route }: NoteEditorProps) => {
  const { addNote, updateNote, notes } = useNotes();

  const [noteId, setNoteId] = useState(route.params?.noteId);
  const [defaultValue, setDefaultValue] = useState('');

  const currentNote = notes.find(n => n.id === noteId);

  const [content, setContent] = useState(currentNote?.content || '');
  const [title, setTitle] = useState(currentNote?.title || '');

  const isSaved = Boolean(
    noteId && currentNote?.content === content && currentNote?.title === title,
  );

  const handleSave = async () => {
    const noteData = {
      title,
      content,
    };

    if (noteId) {
      const isPinned = notes.find(n => n.id === noteId)?.isPinned!;
      updateNote(noteId, { ...noteData, isPinned });
    } else {
      const newId = addNote(noteData);
      setNoteId(newId);
    }
  };

  useEffect(() => {
    if (currentNote && !defaultValue) {
      setDefaultValue(currentNote.content);
    }
  }, [currentNote, defaultValue]);

  return (
    <SafeAreaView style={styles.pageWrapper}>
      <View style={styles.header}>
        <BackButton />
        <TouchableOpacity
          onPress={handleSave}
          style={styles.backButton}
          disabled={isSaved || !content.trim() || !title.trim()}
        >
          <Icon
            name="floppy-disk"
            size={24}
            color={isSaved ? Colors.placeholder : Colors.white}
          />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <NoteTitleInput title={title} setTitle={setTitle} />
        <NoteContentInput setContent={setContent} defaultValue={defaultValue} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flexGrow: 1,
  },
});

export default NoteEditor;
