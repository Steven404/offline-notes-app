import { FontAwesomeIcon, Props } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
type IconProps = {
  name: IconProp;
  size: number;
  color: string;
} & Omit<Props, 'icon'>;

const Icon = (props: IconProps) => {
  const { name, size, color, ...rest } = {
    ...props,
  };
  return <FontAwesomeIcon icon={name} size={size} color={color} {...rest} />;
};

export default Icon;
