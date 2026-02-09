import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown, IDropdownRef } from 'react-native-element-dropdown';
import IconButton from '../iconButton/IconButton.tsx';
import Colors from '../../styles/colors.ts';
import { useNotes } from '../../providers/NotesContext.tsx';

interface DropdownOption {
  label: string;
  value: string;
}

const dropdownInitialOptions: DropdownOption[] = [
  {
    label: 'Sort By',
    value: 'sort_by',
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
    label: 'Date Ascending',
    value: 'date_ascending',
  },
  {
    label: 'Date Descending',
    value: 'date_descending',
  },
];

const BottomBarHeaderDropdown = () => {
  const dropdownRef = useRef<IDropdownRef>(null);
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>(
    dropdownInitialOptions,
  );

  const { setNotes } = useNotes();

  const handleBlur = () => {
    setDropdownOptions(dropdownInitialOptions);
  };

  const handleChange = (option: DropdownOption) => {
    const { value } = option;
    switch (value) {
      case 'sort_by':
        setDropdownOptions(sortByOptions);
        break;
      case 'settings':
        console.log('Settings clicked');
        break;
      // case 'title_ascending':
    }
  };

  return (
    <View>
      <IconButton
        name={'ellipsis-vertical'}
        size={24}
        color={Colors.textColor}
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
        ref={dropdownRef}
        data={dropdownOptions}
        onChange={handleChange}
        labelField={'label'}
        valueField={'value'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
  dropdownContainer: {
    borderRadius: 10,
    padding: 0,
    width: 150,
  },
});

export default BottomBarHeaderDropdown;
