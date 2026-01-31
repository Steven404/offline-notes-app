import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Colors from '../../styles/colors.ts';

interface SimpleLoadingProps {
  size?: 'small' | 'large';
  centered?: boolean;
}

const SimpleLoading = ({
  size = 'large',
  centered = true,
}: SimpleLoadingProps) => {
  return (
    <View style={centered ? styles.centered : {}}>
      <ActivityIndicator size={size} color={Colors.white} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SimpleLoading;
