import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../../components/backButton/BackButton.tsx';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigation.tsx';
import { useNotes } from '../../../providers/NotesContext.tsx';
import Colors from '../../../styles/colors.ts';
import Icon from '../../../components/icon/Icon.tsx';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import NoteContentInput from '../components/NoteContentInput.tsx';

type NoteProps = StackScreenProps<RootStackParamList, 'note'>;

const Note = ({ route }: NoteProps) => {
  const { noteId } = route.params;
  const { notes } = useNotes();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const note = notes.find(n => n.id === noteId)!;

  return (
    <SafeAreaView style={styles.pageWrapper}>
      <View style={styles.header}>
        <BackButton />
        <TouchableOpacity
          onPress={() => navigation.navigate('noteEditor', { noteId })}
          style={styles.editButton}
        >
          <Icon name="pen-to-square" size={24} color={Colors.textColor} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{note?.title}</Text>
        <NoteContentInput defaultValue={note?.content} isDisplay={true} />
      </ScrollView>
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
  editButton: {
    padding: 8,
  },
  content: {
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
