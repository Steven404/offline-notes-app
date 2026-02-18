import { StyleSheet, View } from 'react-native';
import IconButton from '../iconButton/IconButton.tsx';
import Fonts from '../../styles/Fonts.tsx';
import TextLabel from '../textLabel/TextLabel.tsx';
import BottomBarHeaderDropdown from './BottomBarHeaderDropdown.tsx';
import { useTheme } from '../../providers/ThemeContext.tsx';
import { Theme } from '../../styles/themes.ts';
import React, { useMemo } from 'react';

type BottomBarHeaderProps = {
  title: string;
  showFilters?: boolean;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
};

const BottomBarHeader = ({
  title,
  showFilters,
  onSearchPress,
}: BottomBarHeaderProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <BottomBarHeaderDropdown showFilters={showFilters} />
      <TextLabel text={title} style={styles.text} />
      {onSearchPress ? (
        <IconButton
          name={'search'}
          size={24}
          color={theme.textColor}
          onPress={onSearchPress}
        />
      ) : (
        <View style={styles.emptyView} />
      )}
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    text: {
      fontSize: 36,
      fontFamily: Fonts.MontserratSemiBold,
      color: theme.textColor,
    },
    emptyView: { width: 24 },
  });

export default BottomBarHeader;
