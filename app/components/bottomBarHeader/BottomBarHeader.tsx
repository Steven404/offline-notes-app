import { StyleSheet, View } from 'react-native';
import Colors from '../../styles/colors.ts';
import IconButton from '../iconButton/IconButton.tsx';
import Fonts from '../../styles/Fonts.tsx';
import TextLabel from '../textLabel/TextLabel.tsx';
import BottomBarHeaderDropdown from './BottomBarHeaderDropdown.tsx';

type BottomBarHeaderProps = {
  title: string;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
};

const BottomBarHeader = ({ title, onSearchPress }: BottomBarHeaderProps) => {
  return (
    <View style={styles.container}>
      <BottomBarHeaderDropdown />
      <TextLabel text={title} style={styles.text} />
      {onSearchPress ? (
        <IconButton
          name={'search'}
          size={24}
          color={Colors.textColor}
          onPress={onSearchPress}
        />
      ) : (
        <View style={styles.emptyView} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 36,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.textColor,
  },
  emptyView: { width: 24 },
});

export default BottomBarHeader;
