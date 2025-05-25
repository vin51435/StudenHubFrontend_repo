import { BellOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Input, Menu, Switch, Tooltip } from 'antd';
import { useThemeMode } from '@src/theme/ThemeProvider';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@src/components/themeToggle';
import { useLogout } from '@src/hooks/useLogout';
import { useSearchCommunity } from '@src/hooks/useSearchCommunity';

const TopHeader = () => {
  const { themeMode, toggleTheme } = useThemeMode();
  const { searchCommunity } = useSearchCommunity();
  const logout = useLogout();
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
            console.log('logout clicked');
            e.preventDefault();
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
    <div className="flex items-center gap-6 ml-auto w-full h-full space-between align-center">
      <div className="text-2xl px-4 flex justify-center items-center my-3">StudenHub</div>

      <div className="w-full flex items-center justify-center">
        <Input.Search
          className="max-w-[300px] "
          placeholder="Filled"
          variant="filled"
          allowClear
          onChange={(e) => {
            searchCommunity(e.target.value);
          }}
          onSearch={(value, event) => console.log({ value, event })}
        />
      </div>

      <div className="flex items-center gap-4">
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
    </div>
  );
};

export default TopHeader;
