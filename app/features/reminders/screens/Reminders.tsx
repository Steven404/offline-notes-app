import { StyleSheet, View } from 'react-native';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Colors from '../../../styles/colors.ts';

const Reminders = () => {
  return (
    <View style={styles.pageWrapper}>
      <TextLabel text={'Reminders Screen'} />
    </View>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default Reminders;
