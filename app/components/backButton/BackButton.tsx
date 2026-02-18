import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../iconButton/IconButton.tsx';
import Colors from '../../styles/colors.ts';
import { useTheme } from '../../providers/ThemeContext.tsx';
import { Theme } from '../../styles/themes.ts';

interface BackButtonProps {
  style?: StyleProp<ViewStyle>;
  color?: string;
  size?: number;
  onPress?: () => void;
}

const BackButton = ({
  style,
  color = '',
  size = 24,
  onPress,
}: BackButtonProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

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
      color={color ? color : theme.textColor}
    />
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    backButton: {
      padding: 8,
    },
  });

export default BackButton;
