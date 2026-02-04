import { StyleSheet, TextInput } from 'react-native';
import Colors from '../../../styles/colors.ts';
import { useRef } from 'react';

interface NoteTitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

const NoteTitleInput = ({ title, setTitle }: NoteTitleInputProps) => {
  const textInputRef = useRef<TextInput>(null);
  const initialised = useRef(false);

  return (
    <TextInput
      ref={textInputRef}
      style={[styles.input]}
      placeholder={'Title'}
      placeholderTextColor={Colors.placeholder}
      value={title}
      onChangeText={text => {
        setTitle(text);
        // The following if statements fixes input not growing on iOS devices
        if (!initialised.current && text?.trim()) {
          initialised.current = true;
          textInputRef.current?.setNativeProps({ text });
        }
      }}
      maxLength={50}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingVertical: 14,
    fontSize: 48,
    color: Colors.textColor,
  },
});

export default NoteTitleInput;
