import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Colors from '../../../styles/colors.ts';
import Icon from '../../../components/icon/Icon.tsx';

interface AddNoteButtonProps {
  onPress: () => void;
}

const AddNoteButton = ({ onPress }: AddNoteButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.addButton,
        pressed && styles.addButtonPressed,
      ]}
      onPress={onPress}
    >
      <Icon name={['fas', 'plus']} size={30} color={Colors.primary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: Colors.background,
    width: 65,
    height: 65,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  addButtonPressed: {
    opacity: 0.5,
    shadowOpacity: 0.35,
    elevation: 7,
    backgroundColor: Colors.background,
  },
});

export default AddNoteButton;
