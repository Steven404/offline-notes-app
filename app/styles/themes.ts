// Contrast targets (WCAG 2.1 AA): text >= 4.5:1, icons and control edges >= 3:1,
// measured against background, darkerBackground and tabBarBackground.
export type Theme = {
  background: string;
  darkerBackground: string;
  tabBarBackground: string;
  black: string;
  textColor: string;
  placeholder: string;
  primary: string;
  /** Text and icons drawn on a `primary` fill */
  onPrimary: string;
  secondary: string;
  /** Text and icons drawn on a `secondary` fill */
  onSecondary: string;
  mutedOrange: string;
  toolbarBackground: string;
  toolbarBackgroundActive: string;
  /** Destructive text and icons on regular surfaces */
  deleteRed: string;
  /** Destructive button fills; pair with `onDanger` */
  deleteRedFill: string;
  onDanger: string;
};

export type ThemeName = 'dark' | 'light';

export const darkTheme: Theme = {
  background: '#252525',
  darkerBackground: '#1a1a1a',
  tabBarBackground: '#303030',
  black: '#000000',
  textColor: '#ffffff',
  placeholder: '#9A9A9A',
  primary: '#ffd048',
  onPrimary: '#1a1a1a',
  secondary: '#48D0FF',
  onSecondary: '#000000',
  mutedOrange: '#FF9F48',
  toolbarBackground: 'rgba(255, 208, 72, 0.8)',
  toolbarBackgroundActive: '#ffd048',
  deleteRed: '#FF6B6B',
  deleteRedFill: '#C62828',
  onDanger: '#FFFFFF',
};

export const lightTheme: Theme = {
  background: '#F5F5F5',
  darkerBackground: '#E0E0E0',
  tabBarBackground: '#FFFFFF',
  black: '#000000',
  textColor: '#1a1a1a',
  placeholder: '#6B6B6B',
  // Deep ochre: the old #F2C94C was 1.6:1 on white
  primary: '#946A00',
  onPrimary: '#FFFFFF',
  secondary: '#007ACC',
  onSecondary: '#FFFFFF',
  mutedOrange: '#e07b00',
  toolbarBackground: 'rgba(148, 106, 0, 0.8)',
  toolbarBackgroundActive: '#946A00',
  deleteRed: '#CC0000',
  deleteRedFill: '#C62828',
  onDanger: '#FFFFFF',
};

export const themes: Record<ThemeName, Theme> = {
  dark: darkTheme,
  light: lightTheme,
};
