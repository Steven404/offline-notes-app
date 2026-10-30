import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import TextLabel from '../../../components/textLabel/TextLabel';
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
      <TextLabel
        text={title}
        variant="sectionLabel"
        tone="secondary"
        style={styles.title}
        accessibilityRole="header"
      />
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
      marginBottom: 8,
      paddingHorizontal: 16,
    },
    content: {
      backgroundColor: theme.tabBarBackground,
      borderRadius: 10,
      overflow: 'hidden',
    },
  });

export default SettingsSection;
