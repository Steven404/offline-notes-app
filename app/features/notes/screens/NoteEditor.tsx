import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../../../styles/colors.ts';
import IconButton from '../../../components/iconButton/IconButton.tsx';
import BackButton from '../../../components/backButton/BackButton.tsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoteTitleInput from '../components/NoteTitleInput.tsx';
import NoteContentInput from '../components/NoteContentInput.tsx';
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { useNotes } from '../../../providers/NotesContext.tsx';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigation.tsx';
import { Toolbar } from '../../../components/enrichedTextToolbar/Toolbar.tsx';
import {
  EnrichedTextInputInstance,
  OnChangeStateEvent,
} from 'react-native-enriched';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type NoteEditorProps = StackScreenProps<RootStackParamList, 'noteEditor'>;

const DEFAULT_STYLE_STATE = {
  isActive: false,
  isConflicting: false,
  isBlocking: false,
};

const DEFAULT_STYLES: OnChangeStateEvent = {
  bold: DEFAULT_STYLE_STATE,
  italic: DEFAULT_STYLE_STATE,
  underline: DEFAULT_STYLE_STATE,
  strikeThrough: DEFAULT_STYLE_STATE,
  inlineCode: DEFAULT_STYLE_STATE,
  h1: DEFAULT_STYLE_STATE,
  h2: DEFAULT_STYLE_STATE,
  h3: DEFAULT_STYLE_STATE,
  h4: DEFAULT_STYLE_STATE,
  h5: DEFAULT_STYLE_STATE,
  h6: DEFAULT_STYLE_STATE,
  blockQuote: DEFAULT_STYLE_STATE,
  codeBlock: DEFAULT_STYLE_STATE,
  orderedList: DEFAULT_STYLE_STATE,
  unorderedList: DEFAULT_STYLE_STATE,
  link: DEFAULT_STYLE_STATE,
  image: DEFAULT_STYLE_STATE,
  mention: DEFAULT_STYLE_STATE,
};

const NoteEditor = ({ route }: NoteEditorProps) => {
  const { addNote, updateNote, notes } = useNotes();

  const [noteId, setNoteId] = useState(route.params?.noteId);
  const [defaultValue, setDefaultValue] = useState('');

  const currentNote = notes.find(n => n.id === noteId);

  const [content, setContent] = useState(currentNote?.content || '');
  const [title, setTitle] = useState(currentNote?.title || '');

  const inputRef = useRef<EnrichedTextInputInstance>(null);
  const [stylesState, setStylesState] =
    useState<OnChangeStateEvent>(DEFAULT_STYLES);
  const [isContentFocused, setIsContentFocused] = useState(false);

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
    <SafeAreaView style={styles.pageWrapper} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <BackButton />
        <IconButton
          onPress={handleSave}
          touchableOpacityProps={{
            style: styles.backButton,
            disabled: isSaved || !content.trim() || !title.trim(),
          }}
          name="floppy-disk"
          size={24}
          color={isSaved ? Colors.placeholder : Colors.textColor}
        />
      </View>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <NoteTitleInput title={title} setTitle={setTitle} />
        <NoteContentInput
          setContent={setContent}
          defaultValue={defaultValue}
          inputRef={inputRef}
          onChangeState={setStylesState}
          onFocusChange={setIsContentFocused}
        />
      </KeyboardAwareScrollView>
      {isContentFocused && (
        <KeyboardStickyView>
          <Animated.View entering={FadeIn.delay(200)} exiting={FadeOut}>
            <Toolbar
              editorRef={inputRef}
              stylesState={stylesState}
              onOpenLinkModal={() => {}}
              onSelectImage={() => {}}
            />
          </Animated.View>
        </KeyboardStickyView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingBottom: 0,
  },
  header: {
    padding: 14,
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
