import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Icon from '../icon/Icon.tsx';
import { useTheme } from '../../providers/ThemeContext.tsx';

interface AddItemButtonProps {
  onPress: () => void;
  iconName?: IconProp;
  size?: number;
  buttonColor?: string;
  iconColor?: string;
  style?: ViewStyle;
}

const AddItemButton: React.FC<AddItemButtonProps> = ({
  onPress,
  iconName = ['fas', 'plus'] as IconProp,
  size = 30,
  buttonColor,
  iconColor,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.addButton,
        { backgroundColor: buttonColor || theme.background },
        pressed && styles.addButtonPressed,
        style,
      ]}
      onPress={onPress}
    >
      <Icon
        name={iconName}
        size={size}
        color={iconColor || theme.primary}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
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
  },
});

export default AddItemButton;
