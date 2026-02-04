import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../../components/backButton/BackButton.tsx';
import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigation.tsx';
import { useNotes } from '../../../providers/NotesContext.tsx';
import Colors from '../../../styles/colors.ts';
import Icon from '../../../components/icon/Icon.tsx';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import NoteContentInput from '../components/NoteContentInput.tsx';
import DeleteNoteModal from '../components/DeleteNoteModal.tsx';

type NoteProps = StackScreenProps<RootStackParamList, 'note'>;

const Note = ({ route }: NoteProps) => {
  const { noteId } = route.params;
  const { notes, deleteNote } = useNotes();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const note = notes.find(n => n.id === noteId)!;

  const confirmNoteDeletion = () => {
    deleteNote(noteId);
    setIsDeleteModalVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.pageWrapper}>
      <View style={styles.header}>
        <BackButton />
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => setIsDeleteModalVisible(true)}
            style={styles.deleteButton}
          >
            <Icon name="trash" size={24} color={Colors.deleteRed} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('noteEditor', { noteId })}
            style={styles.editButton}
          >
            <Icon name="pen-to-square" size={24} color={Colors.textColor} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.title}>{note?.title}</Text>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <NoteContentInput defaultValue={note?.content} isDisplay={true} />
      </ScrollView>
      <DeleteNoteModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={confirmNoteDeletion}
      />
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
    marginRight: 8,
  },
  content: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.placeholder,
    flex: 1,
  },
  title: {
    width: '100%',
    paddingVertical: 14,
    fontSize: 48,
    color: Colors.textColor,
  },
});

export default Note;
