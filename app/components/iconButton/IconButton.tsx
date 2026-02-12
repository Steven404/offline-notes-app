import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import Icon from '../icon/Icon.tsx';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Props as FontAwesomeProps } from '@fortawesome/react-native-fontawesome';

type IconProps = {
  name: IconProp;
  size: number;
  color: string;
  iconStyle?: any;
} & Omit<FontAwesomeProps, 'icon'>;

type IconButtonProps = IconProps & {
  onPress: () => void;
  touchableOpacityProps?: Omit<TouchableOpacityProps, 'onPress'>;
};

const IconButton = (props: IconButtonProps) => {
  const { onPress, touchableOpacityProps, iconStyle, ...iconProps } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      {...touchableOpacityProps}
      style={touchableOpacityProps?.style}
    >
      <Icon style={iconStyle} {...iconProps} />
    </TouchableOpacity>
  );
};

export default IconButton;
