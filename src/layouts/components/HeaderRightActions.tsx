import { BellOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Menu, Switch, Tooltip } from 'antd';
import { useThemeMode } from '@src/theme/ThemeProvider';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@src/components/themeToggle';
import { useLogout } from '@src/hooks/useLogout';

export const HeaderRightActions = () => {
  const logout = useLogout();
  const { themeMode, toggleTheme } = useThemeMode();
  const [unreadCount] = useState(3); // Mock count

  const menuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: (
        <span
          onClick={(e) => {
            e.preventDefault(); // 🛑 prevent form submission
            logout();
          }}
          className="cursor-pointer"
        >
          Logout
        </span>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-6 ml-auto pr-4">
      {/* Theme Switch */}
      <Tooltip title={themeMode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}>
        <div>
          <ThemeToggle />
        </div>
      </Tooltip>

      {/* Notification Bell */}
      <Tooltip title="Notifications">
        <div>
          <Badge count={unreadCount} size="small">
            <BellOutlined className="text-lg cursor-pointer" />
          </Badge>
        </div>
      </Tooltip>

      {/* User Avatar */}
      <Dropdown menu={{ items: menuItems }} trigger={['click']}>
        <div>
          <Avatar size="small" className="cursor-pointer" icon={<UserOutlined />} />
        </div>
      </Dropdown>
    </div>
  );
};
