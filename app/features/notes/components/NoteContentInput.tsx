import { Pressable, StyleSheet, View } from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import {
  EnrichedTextInput,
  EnrichedTextInputInstance,
  OnChangeStateEvent,
} from 'react-native-enriched';
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
  /** Height of the editor area below the title. Taps in that area focus the content. */
  areaHeight?: number;
}

const NoteContentInput = ({
  defaultValue,
  setContent,
  isDisplay = false,
  inputRef: externalRef,
  onChangeState,
  onFocusChange,
  areaHeight = 0,
}: NoteContentInputProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const internalRef = useRef<EnrichedTextInputInstance>(null);
  const inputRef = externalRef || internalRef;
  const [inputHeight, setInputHeight] = useState(0);

  const handleFocus = () => onFocusChange?.(true);
  const handleBlur = () => onFocusChange?.(false);
  const focusContent = () => {
    inputRef.current?.focus();
  };
  const tapAreaHeight = Math.max(0, areaHeight - inputHeight);

  //TODO: Check which text features you want to keep in the enriched text
  return (
    <View style={isDisplay ? styles.componentWrapper : undefined}>
      <EnrichedTextInput
        ref={inputRef}
        onBlur={handleBlur}
        onFocus={handleFocus}
        scrollEnabled={isDisplay}
        style={[
          styles.input,
          isDisplay ? styles.noHorizontalPadding : styles.withHorizontalPadding,
        ]}
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
        onLayout={event => {
          if (isDisplay) {
            return;
          }
          const nextHeight = event.nativeEvent.layout.height;
          setInputHeight(current =>
            Math.abs(current - nextHeight) < 1 ? current : nextHeight,
          );
        }}
      />
      {!isDisplay && tapAreaHeight > 0 && (
        <Pressable
          accessible={false}
          style={{ height: tapAreaHeight }}
          onPress={focusContent}
        />
      )}
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
