import { type FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Icon from '../icon/Icon.tsx';
import { IconName } from '@fortawesome/free-solid-svg-icons';
import Colors from '../../styles/colors.ts';

interface ToolbarButtonIconProps {
  text?: never;
  icon: IconName;
  isActive: boolean;
  isDisabled: boolean;
  onPress: () => void;
}

interface ToolbarButtonTextProps {
  text: string;
  icon?: never;
  isActive: boolean;
  isDisabled: boolean;
  onPress: () => void;
}

export type ToolbarButtonProps =
  | ToolbarButtonIconProps
  | ToolbarButtonTextProps;

export const ToolbarButton: FC<ToolbarButtonProps> = ({
  icon,
  text,
  isActive,
  isDisabled,
  onPress,
}) => {
  return (
    <Pressable
      style={[
        styles.container,
        isActive && styles.containerActive,
        isDisabled && styles.containerDisabled,
      ]}
      disabled={isDisabled}
      onPress={onPress}
    >
      {icon ? (
        <Icon name={icon} size={20} color={Colors.black} />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    backgroundColor: Colors.toolbarBackground,
  },
  containerActive: {
    backgroundColor: Colors.toolbarBackgroundActive,
  },
  containerDisabled: {
    backgroundColor: Colors.toolbarBackgroundActive,
    opacity: 0.3,
  },
  text: {
    color: Colors.black,
    fontSize: 20,
  },
});
