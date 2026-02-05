import { ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '../../styles/colors.ts';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface SimpleLoadingProps {
  size?: 'small' | 'large';
  centered?: boolean;
}

const SimpleLoading = ({
  size = 'large',
  centered = true,
}: SimpleLoadingProps) => {
  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      style={centered ? styles.centered : {}}
    >
      <ActivityIndicator size={size} color={Colors.secondary} />
    </Animated.View>
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
