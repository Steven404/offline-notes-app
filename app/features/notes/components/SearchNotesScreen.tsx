import { StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  LinearTransition,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import colors from '../../../styles/colors.ts';
import Icon from '../../../components/icon/Icon.tsx';
import BackButton from '../../../components/backButton/BackButton.tsx';
import { JSX, useCallback, useState } from 'react';
import { useNotes } from '../../../providers/NotesContext.tsx';
import { Note } from '../NoteTypes.ts';
import { debounce } from 'lodash';

type SearchNotesScreenProps = {
  onBackButtonPress: () => void;
  renderNote: ({ item }: { item: Note }) => JSX.Element;
};

const SearchNotesScreen = ({
  onBackButtonPress,
  renderNote,
}: SearchNotesScreenProps) => {
  const { notes } = useNotes();
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  const filterNotes = (text: string) => {
    if (!text) {
      setFilteredNotes([]);
      return;
    }
    setFilteredNotes(
      notes.filter(note =>
        note.title.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(filterNotes, 500), [notes]);

  return (
    <Animated.View
      entering={SlideInDown.delay(100).duration(500)}
      exiting={SlideOutDown.duration(500)}
      style={styles.container}
    >
      <View style={styles.header}>
        <BackButton onPress={onBackButtonPress} />
        <View style={styles.searchBar}>
          <Icon
            name={['fas', 'magnifying-glass']}
            size={18}
            color={colors.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            selectionColor={colors.secondary}
            placeholder="Search notes..."
            placeholderTextColor={colors.placeholder}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
      </View>
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  searchBar: {
    width: '87.5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tabBarBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginVertical: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: colors.textColor,
    fontSize: 16,
    height: '100%',
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default SearchNotesScreen;
