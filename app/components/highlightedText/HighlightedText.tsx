import { useMemo } from 'react';
import { Text, TextStyle } from 'react-native';

interface Props {
  text: string;
  searchTerm?: string;
  style?: TextStyle | TextStyle[];
  highlightStyle?: TextStyle;
}

//TODO: Ask an AI model what does this regex mean cause i don't remember
const escapeRegex = (term: string) =>
  term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const HighlightedText = ({
  text,
  searchTerm = '',
  style,
  highlightStyle,
}: Props) => {
  const parts = useMemo(() => {
    if (!searchTerm?.trim()) return null;
    return text.split(new RegExp(`(${escapeRegex(searchTerm)})`, 'gi'));
  }, [text, searchTerm]);

  if (!parts) {
    return <Text style={style}>{text}</Text>;
  }

  const lowerTerm = searchTerm.toLowerCase();

  return (
    <Text style={style}>
      {parts.map((part, index) =>
        part.toLowerCase() === lowerTerm ? (
          <Text key={index} style={highlightStyle}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
};

export default HighlightedText;
