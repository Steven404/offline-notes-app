import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
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
import { useNavigation } from '@react-navigation/native';
import SimpleConfirmModal from '../../../components/simpleConfirmModal/SimpleConfirmModal.tsx';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';

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
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const navigation = useNavigation();
  const [isUnsavedModalVisible, setIsUnsavedModalVisible] = useState(false);

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
    let noteData = {
      title,
      content,
    };

    if (noteId) {
      const oldNoteData = notes.find(n => n.id === noteId)!;
      updateNote(noteId, {
        ...noteData,
        reminder: oldNoteData.reminder,
        isPinned: oldNoteData.isPinned,
      });
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

  const hasUnsavedChanges = Boolean(
    !isSaved && content.trim() && content !== '<html>\n</html>' && title.trim(),
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (hasUnsavedChanges) {
          setIsUnsavedModalVisible(true);
          return true;
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, [hasUnsavedChanges]);

  const handleBackPress = () => {
    if (hasUnsavedChanges) {
      console.log(Boolean(title.trim()), title.trim());
      setIsUnsavedModalVisible(true);
    } else {
      navigation.goBack();
    }
  };

  const handleDiscardAndGoBack = () => {
    setIsUnsavedModalVisible(false);
    navigation.goBack();
  };

  const handleSaveAndGoBack = async () => {
    setIsUnsavedModalVisible(false);
    await handleSave();
    navigation.goBack();
  };

  const saveButtonDisabled = isSaved || !content.trim() || !title.trim();

  return (
    <SafeAreaView style={styles.pageWrapper} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <BackButton onPress={handleBackPress} />
        <IconButton
          onPress={handleSave}
          touchableOpacityProps={{
            style: styles.backButton,
            disabled: saveButtonDisabled,
          }}
          name="floppy-disk"
          size={24}
          color={saveButtonDisabled ? theme.placeholder : theme.textColor}
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
      <SimpleConfirmModal
        isVisible={isUnsavedModalVisible}
        onClose={handleDiscardAndGoBack}
        onConfirm={handleSaveAndGoBack}
        text="You have unsaved changes, would you like to save before leaving this screen?"
        confirmText="Yes"
        cancelText="No"
        confirmButtonColor={theme.primary}
      />
    </SafeAreaView>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    pageWrapper: {
      flex: 1,
      backgroundColor: theme.background,
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
