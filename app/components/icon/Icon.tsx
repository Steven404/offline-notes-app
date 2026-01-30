import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
type Props = {
  name: IconProp;
  size: number;
  color: string;
};

const Icon = (props: Props) => {
  const { name, size, color } = {
    ...props,
  };
  return <FontAwesomeIcon icon={name} size={size} color={color} />;
};

export default Icon;
