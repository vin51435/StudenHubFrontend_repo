import { useThemeMode } from '@src/theme/ThemeProvider';
import { Switch } from 'antd';

const ThemeToggle = ({ className }: { className: string }) => {
  const { themeMode, toggleTheme } = useThemeMode();

  return (
    <Switch
      checked={themeMode === 'dark'}
      onChange={toggleTheme}
      checkedChildren="🌙"
      unCheckedChildren="☀️"
      // disabled
    />
  );
};

export default ThemeToggle;
