import { StyleSheet, TextInput } from 'react-native';
import Colors from '../../../styles/colors.ts';
import { useRef } from 'react';
import Fonts from '../../../styles/Fonts.tsx';

interface NoteTitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

const NoteTitleInput = ({ title, setTitle }: NoteTitleInputProps) => {
  const textInputRef = useRef<TextInput>(null);
  const initialised = useRef(false);

  //TODO: Enter should take you to the content input instead of a new line in the title

  return (
    <TextInput
      ref={textInputRef}
      style={[styles.input]}
      placeholder={'Title'}
      placeholderTextColor={Colors.placeholder}
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

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingVertical: 14,
    fontSize: 32,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.textColor,
  },
});

export default NoteTitleInput;
