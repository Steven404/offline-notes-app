import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import TextLabel from '../../../components/textLabel/TextLabel';
import Icon from '../../../components/icon/Icon';
import Colors from '../../../styles/colors';
import Fonts from '../../../styles/Fonts';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface SettingsItemProps {
  icon: IconProp;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}

const SettingsItem = ({ icon, label, onPress, isLast }: SettingsItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, !isLast && styles.borderBottom]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={20} color={Colors.primary} />
        </View>
        <TextLabel text={label} style={styles.label} />
      </View>
      <Icon name="chevron-right" size={18} color={Colors.placeholder} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
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
    backgroundColor: Colors.darkerBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.textColor,
  },
});

export default SettingsItem;
