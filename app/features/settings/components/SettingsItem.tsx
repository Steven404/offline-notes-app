import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import TextLabel from '../../../components/textLabel/TextLabel';
import Icon from '../../../components/icon/Icon';
import Fonts from '../../../styles/Fonts';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Theme } from '../../../styles/themes.ts';
import { useTheme } from '../../../providers/ThemeContext.tsx';

interface SettingsItemProps {
  icon: IconProp;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}

const SettingsItem = ({ icon, label, onPress, isLast }: SettingsItemProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={[styles.container, !isLast && styles.borderBottom]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={20} color={theme.primary} />
        </View>
        <TextLabel text={label} style={styles.label} />
      </View>
      <Icon name="chevron-right" size={18} color={theme.placeholder} />
    </TouchableOpacity>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: theme.background,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontSize: 16,
      fontFamily: Fonts.MontserratRegular,
      color: theme.textColor,
    },
  });

export default SettingsItem;
