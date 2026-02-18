import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import TextLabel from '../../../components/textLabel/TextLabel';
import Colors from '../../../styles/colors';
import Fonts from '../../../styles/Fonts';
import { Theme } from '../../../styles/themes.ts';
import { useTheme } from '../../../providers/ThemeContext.tsx';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <TextLabel text={title} style={styles.title} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: 32,
    },
    title: {
      fontSize: 14,
      fontFamily: Fonts.MontserratSemiBold,
      color: theme.placeholder,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    content: {
      backgroundColor: theme.tabBarBackground,
      borderRadius: 10,
      overflow: 'hidden',
    },
  });

export default SettingsSection;
