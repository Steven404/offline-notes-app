import React, { createContext, useContext, useEffect, useState } from 'react';
import { themes, Theme, ThemeName } from '../styles/themes';
import { getDataFromStorage, storeData } from '../utils/asyncStorage';

const THEME_STORAGE_KEY = 'theme_preference';

type ThemeContextType = {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [themeName, setThemeName] = useState<ThemeName>('dark');

  useEffect(() => {
    getDataFromStorage(THEME_STORAGE_KEY).then(saved => {
      if (saved === 'light' || saved === 'dark') {
        setThemeName(saved);
      }
    });
  }, []);

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
    storeData(THEME_STORAGE_KEY, name);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[themeName], themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
