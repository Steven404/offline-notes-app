import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import TextLabel from '../textLabel/TextLabel.tsx';
import Icon from '../icon/Icon.tsx';
import { useTheme } from '../../providers/ThemeContext.tsx';
import { Theme } from '../../styles/themes.ts';

export type ButtonVariant = 'primary' | 'danger' | 'secondary' | 'plain';

interface ButtonProps {
  label: string;
  onPress: () => void;
  /**
   * primary: the one main action. danger: a confirmed destructive action.
   * secondary: an outlined alternative (Cancel beside a primary).
   * plain: text-only, for low-emphasis actions in sheets and toolbars.
   */
  variant?: ButtonVariant;
  /** Plain buttons only: color the label as destructive */
  destructive?: boolean;
  icon?: IconProp;
  disabled?: boolean;
  /** Share a row equally with sibling buttons */
  stretch?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
}

const Button = ({
  label,
  onPress,
  variant = 'primary',
  destructive = false,
  icon,
  disabled = false,
  stretch = false,
  style,
  accessibilityHint,
}: ButtonProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const contentColor = {
    primary: theme.onPrimary,
    danger: theme.onDanger,
    secondary: theme.textColor,
    plain: destructive ? theme.deleteRed : theme.primary,
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        stretch && styles.stretch,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && <Icon name={icon} size={16} color={contentColor} />}
        <TextLabel
          text={label}
          variant="button"
          numberOfLines={1}
          style={{ color: contentColor }}
        />
      </View>
    </Pressable>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      minHeight: 44,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: theme.primary,
    },
    danger: {
      backgroundColor: theme.deleteRedFill,
    },
    secondary: {
      borderWidth: 1,
      borderColor: theme.placeholder + '66',
    },
    plain: {
      paddingHorizontal: 12,
    },
    stretch: {
      flex: 1,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    pressed: {
      opacity: 0.75,
    },
    disabled: {
      opacity: 0.4,
    },
  });

export default Button;
