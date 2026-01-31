import { StyleSheet, TextInput, View } from 'react-native';
import Colors from '../../../styles/colors.ts';
import { useEffect, useRef, useState } from 'react';

const NoteTitleInput = () => {
  const textInputRef = useRef<TextInput>(null);
  const initialised = useRef(false);

  return (
    <View>
      <TextInput
        ref={textInputRef}
        style={[styles.input]}
        placeholder={'Title'}
        placeholderTextColor={Colors.placeholder}
        onChangeText={text => {
          // The following if statements fixes input not growing on iOS devices
          if (!initialised.current && text?.trim()) {
            initialised.current = true;
            textInputRef.current?.setNativeProps({ text });
          }
        }}
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingVertical: 14,
    fontSize: 48,
    color: Colors.white,
  },
});

export default NoteTitleInput;
