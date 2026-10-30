import { useMemo, type FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Icon from '../icon/Icon.tsx';
import { IconName } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../providers/ThemeContext.tsx';
import { Theme } from '../../styles/themes.ts';

interface ToolbarButtonIconProps {
  label: string;
  text?: never;
  icon: IconName;
  isActive: boolean;
  isDisabled: boolean;
  onPress: () => void;
}

interface ToolbarButtonTextProps {
  label: string;
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
  label,
  icon,
  text,
  isActive,
  isDisabled,
  onPress,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Pressable
      style={[
        styles.container,
        isActive && styles.containerActive,
        isDisabled && styles.containerDisabled,
      ]}
      disabled={isDisabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive, disabled: isDisabled }}
    >
      {icon ? (
        <Icon
          name={icon}
          size={20}
          color={isActive ? theme.primary : theme.textColor}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isActive && { color: theme.primary, fontWeight: 'bold' },
          ]}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 44,
      height: 44,
      marginHorizontal: 2,
    },
    containerActive: {
      backgroundColor: theme.primary + '26',
      borderRadius: 8,
      marginVertical: 6,
    },
    containerDisabled: {
      opacity: 0.3,
    },
    text: {
      color: theme.textColor,
      fontSize: 16,
    },
  });
