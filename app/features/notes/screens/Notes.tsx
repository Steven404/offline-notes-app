import { StyleSheet, View } from 'react-native';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Colors from '../../../styles/colors.ts';

const Notes = () => {
  return (
    <View style={styles.pageWrapper}>
      <TextLabel text={'Notes Screen'} />
    </View>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default Notes;
