import { StyleSheet, View } from 'react-native';
import TextLabel from '../textLabel/TextLabel.tsx';
import React from 'react';
import Colors from '../../styles/colors.ts';
import Fonts from '../../styles/Fonts.tsx';
import BackButton from '../backButton/BackButton.tsx';

type Props = {
  title: string;
  onBackPress?: () => void;
};

const SimpleBackHeader = ({ title, onBackPress }: Props) => {
  return (
    <View style={styles.header}>
      <View style={styles.backButtonView}>
        <BackButton onPress={onBackPress} />
      </View>
      <TextLabel text={title} style={styles.headerTitle} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tabBarBackground,
  },
  backButtonView: {
    position: 'absolute',
    left: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Fonts.MontserratBold,
    color: Colors.textColor,
    alignSelf: 'center',
  },
});

export default SimpleBackHeader;
