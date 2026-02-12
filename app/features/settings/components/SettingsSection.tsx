import React from 'react';
import { StyleSheet, View } from 'react-native';
import TextLabel from '../../../components/textLabel/TextLabel';
import Colors from '../../../styles/colors';
import Fonts from '../../../styles/Fonts';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  return (
    <View style={styles.container}>
      <TextLabel text={title} style={styles.title} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.placeholder,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  content: {
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default SettingsSection;
