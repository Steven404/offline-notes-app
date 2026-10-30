import IconButton from '../iconButton/IconButton.tsx';
import BottomBarHeaderDropdown from './BottomBarHeaderDropdown.tsx';
import ScreenHeader from '../screenHeader/ScreenHeader.tsx';
import { useTheme } from '../../providers/ThemeContext.tsx';
import React from 'react';

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

  return (
    <ScreenHeader
      variant="large"
      title={title}
      leading={<BottomBarHeaderDropdown showFilters={showFilters} />}
      trailing={
        onSearchPress ? (
          <IconButton
            label={`Search ${title.toLowerCase()}`}
            name={'search'}
            size={22}
            color={theme.textColor}
            onPress={onSearchPress}
          />
        ) : null
      }
    />
  );
};

export default BottomBarHeader;
