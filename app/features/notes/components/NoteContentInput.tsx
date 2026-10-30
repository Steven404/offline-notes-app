import { Pressable, StyleSheet, View } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  EnrichedTextInput,
  EnrichedTextInputInstance,
  OnChangeStateEvent,
} from 'react-native-enriched';
import { typeStyle } from '../../../styles/typography.ts';
import {
  exitEmptyListItem,
  sanitizeNoteContent,
} from '../../../utils/functions.ts';
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

  // Enter on an empty list item should end the list, but the editor keeps
  // adding items. These refs follow the cursor so a second Enter on an item
  // that is still empty can be undone, see `exitEmptyListItem`.
  const htmlRef = useRef(defaultValue ?? '');
  const isListActiveRef = useRef(false);
  const cursorRef = useRef(0);
  const awaitingNewItemRef = useRef(false);
  const emptyItemCursorRef = useRef<number | null>(null);
  const pendingExitRef = useRef<{ html: string; cursor: number } | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearExitTimeout = () => {
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
    }
  };

  useEffect(() => clearExitTimeout, []);

  const handleKeyPress = (key: string) => {
    if (key !== 'Enter' || !isListActiveRef.current) {
      awaitingNewItemRef.current = false;
      emptyItemCursorRef.current = null;
      return;
    }
    if (emptyItemCursorRef.current === cursorRef.current) {
      pendingExitRef.current = {
        html: htmlRef.current,
        cursor: cursorRef.current,
      };
      emptyItemCursorRef.current = null;
      return;
    }
    awaitingNewItemRef.current = true;
  };

  const handleSelectionChange = (start: number) => {
    cursorRef.current = start;
    if (awaitingNewItemRef.current) {
      // The cursor just landed on the item that Enter created
      awaitingNewItemRef.current = false;
      emptyItemCursorRef.current = start;
    } else if (start !== emptyItemCursorRef.current) {
      emptyItemCursorRef.current = null;
    }
  };

  // The editor sends a few HTML updates per Enter, act once they settle
  const exitListIfPending = () => {
    if (!pendingExitRef.current) {
      return;
    }
    clearExitTimeout();
    exitTimeoutRef.current = setTimeout(async () => {
      const pending = pendingExitRef.current;
      pendingExitRef.current = null;
      const editor = inputRef.current;
      if (!pending || !editor) {
        return;
      }
      const html = await editor.getHTML();
      const next = exitEmptyListItem(pending.html, html);
      if (next) {
        editor.setValue(next);
        // The new paragraph keeps a zero-width space where the item had its
        // marker, so the cursor goes back to the same spot
        editor.setSelection(pending.cursor, pending.cursor);
      }
    }, 30);
  };

  const handleFocus = () => onFocusChange?.(true);
  const handleBlur = () => onFocusChange?.(false);
  const focusContent = () => {
    inputRef.current?.focus();
  };
  const tapAreaHeight = Math.max(0, areaHeight - inputHeight);

  //TODO: Check which text features you want to keep in the enriched text
  return (
    <View pointerEvents={isDisplay ? 'none' : 'auto'}>
      <EnrichedTextInput
        ref={inputRef}
        onBlur={handleBlur}
        onFocus={handleFocus}
        scrollEnabled={false}
        style={[
          styles.input,
          isDisplay ? styles.noHorizontalPadding : styles.withHorizontalPadding,
        ]}
        editable={!isDisplay}
        placeholder={'Content'}
        placeholderTextColor={theme.placeholder}
        onChangeState={e => {
          isListActiveRef.current =
            e.nativeEvent.orderedList.isActive ||
            e.nativeEvent.unorderedList.isActive;
          onChangeState?.(e.nativeEvent);
        }}
        onKeyPress={e => handleKeyPress(e.nativeEvent.key)}
        onChangeSelection={e => handleSelectionChange(e.nativeEvent.start)}
        onChangeHtml={e => {
          htmlRef.current = e.nativeEvent.value;
          setContent?.(e.nativeEvent.value);
          exitListIfPending();
        }}
        htmlStyle={{
          h1: { fontSize: 26, bold: true },
          h2: { fontSize: 22, bold: true },
          h3: { fontSize: 19, bold: true },
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
    input: {
      ...typeStyle('body'),
      width: '100%',
      color: theme.textColor,
    },
    noHorizontalPadding: { paddingHorizontal: 0 },
    withHorizontalPadding: { paddingHorizontal: 14 },
  });

export default NoteContentInput;
