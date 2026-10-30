import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../../components/backButton/BackButton.tsx';
import React, { useMemo, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigation.tsx';
import { useNotes } from '../../../providers/NotesContext.tsx';
import IconButton from '../../../components/iconButton/IconButton.tsx';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import NoteContentInput from '../components/NoteContentInput.tsx';
import SimpleConfirmModal from '../../../components/simpleConfirmModal/SimpleConfirmModal.tsx';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import { formatDate } from '../../../utils/functions.ts';
import ScreenHeader from '../../../components/screenHeader/ScreenHeader.tsx';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';

type NoteProps = StackScreenProps<RootStackParamList, 'note'>;

const Note = ({ route }: NoteProps) => {
  const { noteId } = route.params;
  const { notes, deleteNote } = useNotes();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const note = notes.find(n => n.id === noteId);

  const confirmNoteDeletion = () => {
    navigation.goBack();
    setTimeout(() => deleteNote(noteId!), 500);
    setIsDeleteModalVisible(false);
  };

  if (!note) {
    return null;
  }

  return (
    <SafeAreaView style={styles.pageWrapper}>
      <ScreenHeader
        leading={<BackButton />}
        trailing={
          <>
            <IconButton
              onPress={() => setIsDeleteModalVisible(true)}
              label="Delete note"
              name="trash"
              size={22}
              color={theme.deleteRed}
            />
            <IconButton
              onPress={() => navigation.navigate('noteEditor', { noteId })}
              label="Edit note"
              name="pen-to-square"
              size={22}
              color={theme.textColor}
            />
          </>
        }
      />
      <TextLabel
        text={note?.title}
        variant="title"
        style={styles.title}
        accessibilityRole="header"
      />
      <View style={styles.dateContainer}>
        <View style={styles.dateTag}>
          <TextLabel text="Created " variant="meta" tone="secondary" />
          <TextLabel text={formatDate(note.createdAt)} variant="meta" />
        </View>
        <View style={styles.dateTag}>
          <TextLabel text="Edited " variant="meta" tone="secondary" />
          <TextLabel text={formatDate(note.updatedAt)} variant="meta" />
        </View>
        {note.reminder && note.reminder.time > Date.now() && (
          <View style={styles.dateTag}>
            <TextLabel text="Reminder " variant="meta" tone="secondary" />
            <TextLabel text={formatDate(note.reminder.time)} variant="meta" />
          </View>
        )}
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <NoteContentInput defaultValue={note?.content} isDisplay={true} />
      </ScrollView>
      <SimpleConfirmModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={confirmNoteDeletion}
        title={'Delete note'}
        text={'Are you sure you want to delete this note?'}
        confirmText={'Delete'}
        cancelText={'Cancel'}
      />
    </SafeAreaView>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    pageWrapper: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 14,
    },
    content: {
      paddingTop: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.placeholder + '66',
      flex: 1,
    },
    title: {
      width: '100%',
      paddingTop: 12,
    },
    dateContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingTop: 8,
      marginBottom: 14,
      gap: 8,
    },
    dateTag: {
      flexDirection: 'row',
      backgroundColor: theme.placeholder + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 20,
      alignItems: 'center',
    },
  });

export default Note;
