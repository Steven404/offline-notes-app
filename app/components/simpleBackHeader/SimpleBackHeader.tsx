import { StyleSheet, View } from 'react-native';
import TextLabel from '../textLabel/TextLabel.tsx';
import React, { useMemo } from 'react';
import Fonts from '../../styles/Fonts.tsx';
import BackButton from '../backButton/BackButton.tsx';
import { Theme } from '../../styles/themes.ts';
import { useTheme } from '../../providers/ThemeContext.tsx';

type Props = {
  title: string;
  onBackPress?: () => void;
};

const SimpleBackHeader = ({ title, onBackPress }: Props) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.header}>
      <View style={styles.backButtonView}>
        <BackButton onPress={onBackPress} />
      </View>
      <TextLabel text={title} style={styles.headerTitle} />
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.tabBarBackground,
    },
    backButtonView: {
      position: 'absolute',
      left: 14,
    },
    headerTitle: {
      fontSize: 28,
      fontFamily: Fonts.MontserratBold,
      color: theme.textColor,
      alignSelf: 'center',
    },
  });

export default SimpleBackHeader;
