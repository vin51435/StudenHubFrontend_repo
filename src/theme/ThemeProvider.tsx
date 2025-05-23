import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import { localStorageUtil } from '@src/utils/localStorageUtil';
import { lightTheme, darkTheme } from './themeConfig';

type ThemeMode = 'light' | 'dark';

const ThemeContext = createContext({
  themeMode: 'light' as ThemeMode,
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => localStorageUtil.getMode());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', themeMode === 'dark');
    localStorageUtil.setMode(themeMode);
  }, [themeMode]);

  const toggleTheme = () => setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ConfigProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
