import { StyleSheet, TextProps } from 'react-native';
import Colors from '../../styles/colors.ts';
import Animated, { EntryOrExitLayoutType } from 'react-native-reanimated';

interface Props extends TextProps {
  text: string;
  entering?: EntryOrExitLayoutType;
  exiting?: EntryOrExitLayoutType;
}

function TextLabel(props: Props) {
  const { text, style, numberOfLines, ...rest } = props;
  return (
    <Animated.Text
      numberOfLines={numberOfLines !== undefined ? numberOfLines : 10}
      style={[styles.text, style]}
      {...rest}
    >
      {text}
    </Animated.Text>
  );
}

export default TextLabel;
const styles = StyleSheet.create({
  text: {
    color: Colors.textColor,
    fontSize: 16,
    textAlign: 'left',
  },
});
