export type Theme = {
  background: string;
  darkerBackground: string;
  tabBarBackground: string;
  black: string;
  textColor: string;
  placeholder: string;
  placeholder2: string;
  primary: string;
  secondary: string;
  mutedOrange: string;
  toolbarBackground: string;
  toolbarBackgroundActive: string;
  deleteRed: string;
};

export type ThemeName = 'dark' | 'light';

export const darkTheme: Theme = {
  background: '#252525',
  darkerBackground: '#1a1a1a',
  tabBarBackground: '#303030',
  black: '#000000',
  textColor: '#ffffff',
  placeholder: '#9A9A9A',
  placeholder2: '#6B6B6B50',
  primary: '#ffd048',
  secondary: '#48D0FF',
  mutedOrange: '#FF9F48',
  toolbarBackground: 'rgba(255, 208, 72, 0.8)',
  toolbarBackgroundActive: '#ffd048',
  deleteRed: '#FF0000',
};

export const lightTheme: Theme = {
  background: '#F5F5F5',
  darkerBackground: '#E0E0E0',
  tabBarBackground: '#FFFFFF',
  black: '#000000',
  textColor: '#1a1a1a',
  placeholder: '#6B6B6B',
  placeholder2: '#6B6B6B50',
  primary: '#F2C94C',
  secondary: '#007ACC',
  mutedOrange: '#e07b00',
  toolbarBackground: 'rgba(230, 184, 0, 0.8)',
  toolbarBackgroundActive: '#e6b800',
  deleteRed: '#CC0000',
};

export const themes: Record<ThemeName, Theme> = {
  dark: darkTheme,
  light: lightTheme,
};
