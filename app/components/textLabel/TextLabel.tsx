import { StyleSheet, TextProps } from 'react-native';
import Animated, { EntryOrExitLayoutType } from 'react-native-reanimated';
import { useTheme } from '../../providers/ThemeContext.tsx';
import { Theme } from '../../styles/themes.ts';
import { useMemo } from 'react';

interface Props extends TextProps {
  text: string;
  entering?: EntryOrExitLayoutType;
  exiting?: EntryOrExitLayoutType;
}

function TextLabel(props: Props) {
  const { text, style, numberOfLines, ...rest } = props;
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Animated.Text
      numberOfLines={numberOfLines !== undefined ? numberOfLines : 10}
      style={[styles.text, style]}
      {...rest}
    >
      {text}
    </Animated.Text>
  );
}

export default TextLabel;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    text: {
      color: theme.textColor,
      fontSize: 16,
      textAlign: 'left',
    },
  });
