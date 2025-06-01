import type { ThemeConfig } from 'antd';

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#4f46e5',
    borderRadius: 8,
    colorBgContainer: '#ffffff',
    colorText: '#1f2937',
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0b1416',
    borderRadius: 8,
    colorBgContainer: '#1f1f1f',
    colorText: '#f9fafb',
  },
};

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#4f46e5', // Indigo (Tailwind's indigo-600)
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
    colorBgContainer: '#fff',
    colorText: '#111827', // slate-900
    fontSize: 14,
  },
  components: {
    Layout: {
      headerHeight: 64,
      siderBg: '#1f2937', // gray-800
    },
    Button: {
      borderRadius: 8,
    },
    Menu: {
      itemBorderRadius: 8,
    },
  },
};

export default themeConfig;
