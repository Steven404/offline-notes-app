/**
 * Formats a timestamp into a readable date string like "Feb 6 2026".
 * @param timestamp - The timestamp to format.
 * @returns A formatted date string.
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day} ${year}`;
};
