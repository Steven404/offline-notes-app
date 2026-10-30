import { StyleSheet, TextInput } from 'react-native';
import { useMemo, useRef } from 'react';
import { Type, typeStyle } from '../../../styles/typography.ts';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';

interface NoteTitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

const NoteTitleInput = ({ title, setTitle }: NoteTitleInputProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const textInputRef = useRef<TextInput>(null);
  const initialised = useRef(false);

  //TODO: Enter should take you to the content input instead of a new line in the title

  return (
    <TextInput
      ref={textInputRef}
      style={[styles.input]}
      placeholder={'Title'}
      accessibilityLabel="Note title"
      placeholderTextColor={theme.placeholder}
      value={title}
      onChangeText={text => {
        setTitle(text);
        // The following if statements fixes input not growing on iOS devices (applies when multiline={true})
        if (!initialised.current && text?.trim()) {
          initialised.current = true;
          textInputRef.current?.setNativeProps({ text });
        }
      }}
      maxFontSizeMultiplier={Type.title.maxFontSizeMultiplier}
      maxLength={50}
      multiline={true}
      numberOfLines={4}
    />
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    input: {
      ...typeStyle('title'),
      width: '100%',
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 8,
      color: theme.textColor,
    },
  });

export default NoteTitleInput;
