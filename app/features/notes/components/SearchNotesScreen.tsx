import { StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  LinearTransition,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import Icon from '../../../components/icon/Icon.tsx';
import BackButton from '../../../components/backButton/BackButton.tsx';
import { JSX, useCallback, useMemo, useState } from 'react';
import { useNotes } from '../../../providers/NotesContext.tsx';
import { Note } from '../utils/NoteTypes.ts';
import { debounce } from 'lodash';
import { sortNotes } from '../utils/noteUtils.ts';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';

type SearchNotesScreenProps = {
  onBackButtonPress: () => void;
  renderNote: ({ item }: { item: Note }) => JSX.Element;
};

const SearchNotesScreen = ({
  onBackButtonPress,
  renderNote,
}: SearchNotesScreenProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { notes, sortBy } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedNotes = useMemo(() => {
    let result = [...notes];

    if (searchTerm) {
      result = result.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return sortNotes(result, sortBy, false);
  }, [notes, sortBy, searchTerm]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((text: string) => setSearchTerm(text), 500),
    [],
  );

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
            color={theme.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            selectionColor={theme.secondary}
            placeholder="Search notes..."
            placeholderTextColor={theme.placeholder}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
      </View>
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={filteredAndSortedNotes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </Animated.View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      zIndex: 2,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.background,
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
      backgroundColor: theme.tabBarBackground,
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
      color: theme.textColor,
      fontSize: 16,
      height: '100%',
    },
    listContent: {
      padding: 14,
      paddingBottom: 80,
    },
  });

export default SearchNotesScreen;
