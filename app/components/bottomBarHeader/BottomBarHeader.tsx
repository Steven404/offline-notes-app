import { StyleSheet, View } from 'react-native';
import Colors from '../../styles/colors.ts';
import IconButton from '../iconButton/IconButton.tsx';
import Fonts from '../../styles/Fonts.tsx';
import TextLabel from '../textLabel/TextLabel.tsx';

type BottomBarHeaderProps = {
  title: string;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
};

const BottomBarHeader = ({ title }: BottomBarHeaderProps) => {
  return (
    <View style={styles.container}>
      <IconButton
        name={'bars'}
        size={24}
        color={Colors.textColor}
        onPress={() => {}}
      />
      <TextLabel text={title} style={styles.text} />
      <IconButton
        name={'search'}
        size={24}
        color={Colors.textColor}
        onPress={() => {}}
      />
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
});

export default BottomBarHeader;
