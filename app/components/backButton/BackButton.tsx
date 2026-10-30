import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../iconButton/IconButton.tsx';
import { useTheme } from '../../providers/ThemeContext.tsx';

interface BackButtonProps {
  style?: StyleProp<ViewStyle>;
  color?: string;
  size?: number;
  onPress?: () => void;
}

// No padding: IconButton's hitSlop supplies the 44pt target, so the arrow
// lines up with the screen's text edge.
const BackButton = ({
  style,
  color = '',
  size = 22,
  onPress,
}: BackButtonProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <IconButton
      onPress={handlePress}
      touchableOpacityProps={{ style }}
      label="Back"
      name="arrow-left"
      size={size}
      color={color ? color : theme.textColor}
    />
  );
};

export default BackButton;
