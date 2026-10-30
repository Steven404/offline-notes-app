import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Icon from '../icon/Icon.tsx';
import { useTheme } from '../../providers/ThemeContext.tsx';
import { Theme } from '../../styles/themes.ts';

const MIN_TOUCH_TARGET = 44;

const SIZES = {
  md: { box: 22, check: 12, radius: 6 },
  sm: { box: 18, check: 10, radius: 5 },
};

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  /** What is being checked off; read by VoiceOver / TalkBack */
  label: string;
  size?: keyof typeof SIZES;
  style?: ViewStyle;
}

const Checkbox = ({
  checked,
  onToggle,
  label,
  size = 'md',
  style,
}: CheckboxProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const metrics = SIZES[size];
  const slop = Math.ceil((MIN_TOUCH_TARGET - metrics.box) / 2);

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={slop}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      style={({ pressed }) => [style, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.box,
          {
            width: metrics.box,
            height: metrics.box,
            borderRadius: metrics.radius,
          },
          checked && styles.boxChecked,
        ]}
      >
        {checked && (
          <Icon name="check" size={metrics.check} color={theme.onPrimary} />
        )}
      </View>
    </Pressable>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    box: {
      borderWidth: 1.75,
      // placeholder clears 3:1 against every card surface in both themes
      borderColor: theme.placeholder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boxChecked: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    pressed: {
      opacity: 0.6,
    },
  });

export default Checkbox;
