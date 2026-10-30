import React from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import Icon from '../icon/Icon.tsx';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Props as FontAwesomeProps } from '@fortawesome/react-native-fontawesome';

const MIN_TOUCH_TARGET = 44;

type IconProps = {
  name: IconProp;
  size: number;
  color: string;
  iconStyle?: any;
} & Omit<FontAwesomeProps, 'icon'>;

type IconButtonProps = IconProps & {
  onPress: () => void;
  /** Read by VoiceOver / TalkBack; icon-only buttons have no other name */
  label: string;
  role?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessibilityHint?: string;
  touchableOpacityProps?: Omit<TouchableOpacityProps, 'onPress'>;
};

const IconButton = (props: IconButtonProps) => {
  const {
    onPress,
    touchableOpacityProps,
    iconStyle,
    label,
    role = 'button',
    accessibilityState,
    accessibilityHint,
    ...iconProps
  } = props;

  // Extend small icons to a 44pt touch area without changing their layout
  const slop = Math.max(0, Math.ceil((MIN_TOUCH_TARGET - iconProps.size) / 2));

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={slop}
      accessibilityLabel={label}
      accessibilityRole={role}
      accessibilityHint={accessibilityHint}
      {...touchableOpacityProps}
      accessibilityState={{
        disabled: Boolean(touchableOpacityProps?.disabled),
        ...accessibilityState,
      }}
      style={touchableOpacityProps?.style}
    >
      <Icon style={iconStyle} {...iconProps} />
    </TouchableOpacity>
  );
};

export default IconButton;
