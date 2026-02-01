import { StyleSheet, View } from 'react-native';
import {
  EnrichedTextInput,
  EnrichedTextInputInstance,
  OnChangeStateEvent,
} from 'react-native-enriched';
import { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import Colors from '../../../styles/colors.ts';
import Fonts from '../../../styles/Fonts.tsx';
import { Toolbar } from '../../../components/enrichedTextToolbar/Toolbar.tsx';

type StylesState = OnChangeStateEvent;

const DEFAULT_STYLE_STATE = {
  isActive: false,
  isConflicting: false,
  isBlocking: false,
};

const DEFAULT_STYLES: StylesState = {
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

export interface NoteContentInputInstance {
  getContent: () => Promise<string>;
}

interface NoteContentInputProps {
  content: string;
}

const NoteContentInput = forwardRef<
  NoteContentInputInstance,
  NoteContentInputProps
>(({ content }, ref) => {
  const inputRef = useRef<EnrichedTextInputInstance>(null);

  const [stylesState, setStylesState] = useState<StylesState>(DEFAULT_STYLES);
  const [isFocused, setIsFocused] = useState(false);

  useImperativeHandle(ref, () => ({
    getContent: async () => {
      if (inputRef.current) {
        return await inputRef.current.getHTML();
      }
      return content;
    },
  }));

  //TODO: Fix bug that occurs when saving content with list

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  //TODO: Check which text features you want to keep in the enriched text
  return (
    <View style={styles.componentWrapper}>
      <EnrichedTextInput
        ref={inputRef}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={styles.input}
        placeholder={'Content'}
        placeholderTextColor={Colors.placeholder}
        onChangeState={e => setStylesState(e.nativeEvent)}
        defaultValue={content}
      />
      <View style={styles.toolbarContainer}>
        {isFocused && (
          <Toolbar
            editorRef={inputRef}
            stylesState={stylesState}
            onOpenLinkModal={() => {}}
            onSelectImage={() => {}}
          />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  componentWrapper: { flex: 1 },
  input: {
    width: '100%',
    fontSize: 20,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.white,
  },
  toolbarContainer: {
    //TODO: Left and right values shouldn't have to be there, but it's a solution for now. Check parents padding (NoteEditor.tsx) and find a way that the toolbar is not affected by them
    position: 'absolute',
    bottom: 0,
    left: -14,
    right: 0,
  },
});

export default NoteContentInput;
