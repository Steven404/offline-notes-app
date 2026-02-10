import { StyleSheet, View } from 'react-native';
import {
  EnrichedTextInput,
  EnrichedTextInputInstance,
  OnChangeStateEvent,
} from 'react-native-enriched';
import React, { useRef } from 'react';
import Colors from '../../../styles/colors.ts';
import Fonts from '../../../styles/Fonts.tsx';
import { sanitizeNoteContent } from '../../../utils/functions.ts';

interface NoteContentInputProps {
  setContent?: (content: string) => void;
  defaultValue?: string;
  isDisplay?: boolean;
  inputRef?: React.RefObject<EnrichedTextInputInstance | null>;
  onChangeState?: (state: OnChangeStateEvent) => void;
  onFocusChange?: (focused: boolean) => void;
}

const NoteContentInput = ({
  defaultValue,
  setContent,
  isDisplay = false,
  inputRef: externalRef,
  onChangeState,
  onFocusChange,
}: NoteContentInputProps) => {
  const internalRef = useRef<EnrichedTextInputInstance>(null);
  const inputRef = externalRef || internalRef;

  const handleFocus = () => onFocusChange?.(true);
  const handleBlur = () => onFocusChange?.(false);

  //TODO: Check which text features you want to keep in the enriched text
  console.log('isDisplay: ', isDisplay && styles.noHorizontalPadding);
  return (
    <View
      style={[
        styles.componentWrapper,
        isDisplay ? styles.noHorizontalPadding : styles.withHorizontalPadding,
      ]}
    >
      <EnrichedTextInput
        ref={inputRef}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={styles.input}
        editable={!isDisplay}
        placeholder={'Content'}
        placeholderTextColor={Colors.placeholder}
        onChangeState={e => onChangeState?.(e.nativeEvent)}
        onChangeHtml={e => {
          setContent?.(e.nativeEvent.value);
        }}
        htmlStyle={{
          ul: {
            bulletColor: Colors.textColor,
          },
        }}
        defaultValue={
          defaultValue ? sanitizeNoteContent(defaultValue) : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  componentWrapper: { flex: 1 },
  input: {
    width: '100%',
    fontSize: 20,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.textColor,
  },
  noHorizontalPadding: { paddingHorizontal: 0 },
  withHorizontalPadding: { paddingHorizontal: 14 },
});

export default NoteContentInput;
