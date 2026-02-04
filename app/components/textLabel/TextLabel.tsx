import { StyleSheet, Text, TextProps } from 'react-native';
import Colors from '../../styles/colors.ts';

interface Props extends TextProps {
  text: string;
}

function TextLabel(props: Props) {
  const { text, style, numberOfLines, ...rest } = props;
  return (
    <Text
      numberOfLines={numberOfLines !== undefined ? numberOfLines : 10}
      style={[styles.text, style]}
      {...rest}
    >
      {text}
    </Text>
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
