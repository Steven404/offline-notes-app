import React, { ReactNode, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import TextLabel from '../textLabel/TextLabel.tsx';
import { useTheme } from '../../providers/ThemeContext.tsx';
import { Theme } from '../../styles/themes.ts';

interface ScreenHeaderProps {
  title?: string;
  /**
   * large: tab roots. Actions sit on their own row and the title gets a
   * full-width line below, left-aligned, so it never shifts with the actions.
   * inline: pushed screens. Title centered between back and actions.
   */
  variant?: 'large' | 'inline';
  leading?: ReactNode;
  trailing?: ReactNode;
  divider?: boolean;
  style?: ViewStyle;
}

const ScreenHeader = ({
  title,
  variant = 'inline',
  leading,
  trailing,
  divider = false,
  style,
}: ScreenHeaderProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const actionRow = (
    <View style={styles.actionRow}>
      <View style={styles.slot}>{leading}</View>
      {variant === 'inline' && title ? (
        <TextLabel
          text={title}
          variant="heading"
          numberOfLines={1}
          accessibilityRole="header"
          style={styles.inlineTitle}
        />
      ) : null}
      <View style={[styles.slot, styles.trailingSlot]}>{trailing}</View>
    </View>
  );

  return (
    <View style={[divider && styles.divider, style]}>
      {actionRow}
      {variant === 'large' && title ? (
        <TextLabel
          text={title}
          variant="largeTitle"
          numberOfLines={1}
          accessibilityRole="header"
          style={styles.largeTitle}
        />
      ) : null}
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    actionRow: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    slot: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      minWidth: 44,
    },
    trailingSlot: {
      justifyContent: 'flex-end',
    },
    // Absolutely centered so unequal leading/trailing widths don't shift it
    inlineTitle: {
      position: 'absolute',
      left: 64,
      right: 64,
      textAlign: 'center',
    },
    largeTitle: {
      paddingTop: 2,
      paddingBottom: 6,
    },
    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.placeholder + '40',
    },
  });

export default ScreenHeader;
