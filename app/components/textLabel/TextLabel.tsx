import { StyleSheet, TextProps } from 'react-native';
import Animated, { EntryOrExitLayoutType } from 'react-native-reanimated';
import { useTheme } from '../../providers/ThemeContext.tsx';
import { Theme } from '../../styles/themes.ts';
import { useMemo } from 'react';
import { Type, TypeRole, typeStyle } from '../../styles/typography.ts';

export type TextTone = 'primary' | 'secondary' | 'accent' | 'danger';

interface Props extends TextProps {
  text: string;
  variant?: TypeRole;
  tone?: TextTone;
  entering?: EntryOrExitLayoutType;
  exiting?: EntryOrExitLayoutType;
}

const toneColor = (theme: Theme, tone: TextTone) =>
  ({
    primary: theme.textColor,
    secondary: theme.placeholder,
    accent: theme.primary,
    danger: theme.deleteRed,
  }[tone]);

function TextLabel(props: Props) {
  const {
    text,
    style,
    numberOfLines,
    variant = 'label',
    tone = 'primary',
    maxFontSizeMultiplier,
    ...rest
  } = props;
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Animated.Text
      numberOfLines={numberOfLines !== undefined ? numberOfLines : 10}
      maxFontSizeMultiplier={
        maxFontSizeMultiplier ?? Type[variant].maxFontSizeMultiplier
      }
      style={[
        styles.text,
        typeStyle(variant),
        { color: toneColor(theme, tone) },
        style,
      ]}
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
      textAlign: 'left',
    },
  });
