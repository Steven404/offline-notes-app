import { StyleSheet, View } from 'react-native';
import {
  EnrichedTextInput,
  EnrichedTextInputInstance,
  OnChangeStateEvent,
} from 'react-native-enriched';
import React, { useMemo, useRef } from 'react';
import Fonts from '../../../styles/Fonts.tsx';
import { sanitizeNoteContent } from '../../../utils/functions.ts';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';

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
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const internalRef = useRef<EnrichedTextInputInstance>(null);
  const inputRef = externalRef || internalRef;

  const handleFocus = () => onFocusChange?.(true);
  const handleBlur = () => onFocusChange?.(false);

  //TODO: Check which text features you want to keep in the enriched text
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
        placeholderTextColor={theme.placeholder}
        onChangeState={e => onChangeState?.(e.nativeEvent)}
        onChangeHtml={e => {
          setContent?.(e.nativeEvent.value);
        }}
        htmlStyle={{
          ul: {
            bulletColor: theme.textColor,
          },
        }}
        defaultValue={
          defaultValue ? sanitizeNoteContent(defaultValue) : undefined
        }
      />
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    componentWrapper: { flex: 1 },
    input: {
      width: '100%',
      fontSize: 20,
      fontFamily: Fonts.MontserratRegular,
      color: theme.textColor,
    },
    noHorizontalPadding: { paddingHorizontal: 0 },
    withHorizontalPadding: { paddingHorizontal: 14 },
  });

export default NoteContentInput;
