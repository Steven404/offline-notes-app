import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown, IDropdownRef } from 'react-native-element-dropdown';
import IconButton from '../iconButton/IconButton.tsx';
import { SortOption, useNotes } from '../../providers/NotesContext.tsx';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/Navigation.tsx';
import { useTheme } from '../../providers/ThemeContext.tsx';
import { Theme } from '../../styles/themes.ts';

type Props = {
  showFilters?: boolean;
};

interface DropdownOption {
  label: string;
  value: string;
  isFilterOption?: boolean;
}

const dropdownInitialOptions: DropdownOption[] = [
  {
    label: 'Sort By',
    value: 'sort_by',
    isFilterOption: true,
  },
  {
    label: 'Show Pinned',
    value: 'show_pinned',
    isFilterOption: true,
  },
  {
    label: 'Settings',
    value: 'settings',
  },
];

const sortByOptions: DropdownOption[] = [
  {
    label: 'Title Ascending',
    value: 'title_ascending',
  },

  {
    label: 'Title Descending',
    value: 'title_descending',
  },
  {
    label: 'Date Created',
    value: 'createdAt',
  },
  {
    label: 'Date Modified',
    value: 'updatedAt',
  },
];

const dropdownOptionsWithoutFilters: DropdownOption[] = [
  // This used to be a nice filter function but it wasn't working with theme change
  {
    label: 'Settings',
    value: 'settings',
  },
];

const BottomBarHeaderDropdown = ({ showFilters }: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const dropdownRef = useRef<IDropdownRef>(null);
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>(
    dropdownInitialOptions,
  );

  const { setSortBy, showPinnedOnly, setShowPinnedOnly } = useNotes();

  const getInitialOptions = () =>
    showFilters ? dropdownInitialOptions : dropdownOptionsWithoutFilters;

  const handleBlur = () => {
    setDropdownOptions(getInitialOptions());
  };

  const handleChange = (option: DropdownOption) => {
    const { value } = option;
    switch (value) {
      case 'sort_by':
        setDropdownOptions(sortByOptions);
        break;
      case 'settings':
        navigation.navigate('settings');
        dropdownRef.current?.close();
        break;
      case 'show_pinned':
        const newDropdownOptions = [...dropdownOptions];
        newDropdownOptions[1].label = showPinnedOnly
          ? 'Show Pinned'
          : 'Show All';
        setShowPinnedOnly(!showPinnedOnly);
        setDropdownOptions(getInitialOptions());
        dropdownRef.current?.close();
        break;
      case 'title_ascending':
      case 'title_descending':
      case 'createdAt':
      case 'updatedAt':
        setSortBy(value as SortOption);
        setDropdownOptions(getInitialOptions());
        dropdownRef.current?.close();
        break;
    }
  };

  useEffect(() => {
    setDropdownOptions(getInitialOptions());
  }, [showFilters]);

  return (
    <View>
      <IconButton
        name={'ellipsis-vertical'}
        size={24}
        color={theme.textColor}
        onPress={() => {
          dropdownRef.current?.open();
        }}
      />
      <Dropdown
        closeModalWhenSelectedItem={false}
        onBlur={handleBlur}
        placeholderStyle={styles.hidden}
        iconStyle={styles.hidden}
        selectedTextStyle={styles.hidden}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemText}
        ref={dropdownRef}
        data={dropdownOptions}
        onChange={handleChange}
        labelField={'label'}
        valueField={'value'}
      />
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    hidden: {
      display: 'none',
    },
    dropdownContainer: {
      borderRadius: 10,
      padding: 0,
      width: 160,
      backgroundColor: theme.tabBarBackground,
    },
    itemText: { fontSize: 14, color: theme.textColor },
  });

export default BottomBarHeaderDropdown;
