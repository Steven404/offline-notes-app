import { Button, StyleSheet, View } from 'react-native';
import {
  EnrichedTextInput,
  EnrichedTextInputInstance,
  OnChangeStateEvent,
} from 'react-native-enriched';
import { useRef, useState } from 'react';
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

const NoteContentInput = () => {
  const ref = useRef<EnrichedTextInputInstance>(null);

  const [stylesState, setStylesState] = useState<StylesState>(DEFAULT_STYLES);

  //TODO: Check which text features you want to keep in the enriched text
  //TODO: Add KeyboardAwareScrollView and make the toolbar sit at the bottom
  return (
    <View>
      <EnrichedTextInput
        ref={ref}
        style={styles.input}
        placeholder={'Content'}
        placeholderTextColor={Colors.placeholder}
        onChangeState={e => setStylesState(e.nativeEvent)}
      />
      <Toolbar
        editorRef={ref}
        stylesState={stylesState}
        onOpenLinkModal={() => {}}
        onSelectImage={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    fontSize: 20,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.white,
  },
});

export default NoteContentInput;
