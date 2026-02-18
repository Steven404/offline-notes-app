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
import Fonts from '../../../styles/Fonts.tsx';
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
      <View style={styles.header}>
        <BackButton />
        <View style={styles.headerButtons}>
          <IconButton
            onPress={() => setIsDeleteModalVisible(true)}
            name="trash"
            size={24}
            color={theme.deleteRed}
            touchableOpacityProps={{ style: styles.deleteButton }}
          />
          <IconButton
            onPress={() => navigation.navigate('noteEditor', { noteId })}
            name="pen-to-square"
            size={24}
            color={theme.textColor}
            touchableOpacityProps={{ style: styles.editButton }}
          />
        </View>
      </View>
      <TextLabel text={note?.title} style={styles.title} />
      <View style={styles.dateContainer}>
        <View style={styles.dateTag}>
          <TextLabel text="Created: " style={styles.dateLabel} />
          <TextLabel
            text={formatDate(note.createdAt)}
            style={styles.dateValue}
          />
        </View>
        <View style={styles.dateTag}>
          <TextLabel text="Edited: " style={styles.dateLabel} />
          <TextLabel
            text={formatDate(note.updatedAt)}
            style={styles.dateValue}
          />
        </View>
        {note.reminder && note.reminder.time > Date.now() && (
          <View style={styles.dateTag}>
            <TextLabel text="Reminder: " style={styles.dateLabel} />
            <TextLabel
              text={formatDate(note.reminder.time)}
              style={styles.dateValue}
            />
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
      paddingTop: 14,
      borderTopWidth: 0.5,
      borderTopColor: theme.placeholder,
      flex: 1,
    },
    title: {
      width: '100%',
      paddingTop: 14,
      fontSize: 32,
      fontFamily: Fonts.MontserratSemiBold,
      color: theme.textColor,
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
    dateLabel: {
      fontSize: 12,
      color: theme.placeholder,
      fontWeight: '600',
    },
    dateValue: {
      fontSize: 13,
      color: theme.textColor,
    },
  });

export default Note;
