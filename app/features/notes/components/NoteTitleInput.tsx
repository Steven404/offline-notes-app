import { StyleSheet, TextInput } from 'react-native';
import { useMemo, useRef } from 'react';
import Fonts from '../../../styles/Fonts.tsx';
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
      maxLength={50}
      multiline={true}
      numberOfLines={4}
    />
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    input: {
      width: '100%',
      padding: 14,
      fontSize: 32,
      fontFamily: Fonts.MontserratSemiBold,
      color: theme.textColor,
    },
  });

export default NoteTitleInput;
