import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '../icon/Icon.tsx';
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
    <TouchableOpacity onPress={handlePress} style={[styles.backButton, style]}>
      <Icon name="arrow-left" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
});

export default BackButton;
