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

  const pageContent = notes.length > 0 ? <View /> : <NoNotes />;

  return (
    <View style={styles.pageWrapper}>
      <View style={styles.header}>
        <TextLabel text={'Notes'} style={styles.headerText} />
      </View>
      {isLoading ? <SimpleLoading centered /> : pageContent}
      <AddNoteButton
        onPress={() => navigation.navigate('noteEditor', { noteId: '' })}
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
  },
});

export default Notes;
