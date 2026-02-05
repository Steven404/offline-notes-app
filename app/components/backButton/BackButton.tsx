import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../iconButton/IconButton.tsx';
import Colors from '../../styles/colors.ts';

interface BackButtonProps {
  style?: StyleProp<ViewStyle>;
  color?: string;
  size?: number;
  onPress?: () => void;
}

const BackButton = ({
  style,
  color = Colors.textColor,
  size = 24,
  onPress,
}: BackButtonProps) => {
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
      touchableOpacityProps={{ style: [styles.backButton, style] }}
      name="arrow-left"
      size={size}
      color={color}
    />
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
});

export default BackButton;
