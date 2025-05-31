import { BellOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { AutoComplete, Avatar, Badge, Dropdown, Input, Menu, Switch, Tag, Tooltip } from 'antd';
import { useThemeMode } from '@src/theme/ThemeProvider';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ThemeToggle from '@src/components/themeToggle';
import { useLogout } from '@src/hooks/useLogout';
import { ICommunity } from '@src/types/app';
import CommunityOp from '@src/api/communityOperations';
import { matchRoute } from '@src/utils/common';
import { getExactRoutePath } from '@src/utils/getRoutePath';

const TopHeader = () => {
  const [options, setOptions] = useState<{ value: string; label: React.ReactNode }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [unreadCount] = useState(3); // Mock count
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { themeMode, toggleTheme } = useThemeMode();
  const logout = useLogout();

  useEffect(() => {
    if (slug) {
      const matchSlug = matchRoute(getExactRoutePath('COMMUNITY'), pathname);
      if (matchSlug === slug) {
        CommunityOp.setCommunitySlug(slug);
      }
    }
  }, [slug]);

  async function searchCommunity(value: string) {
    setInputValue(value);
    const res = await CommunityOp.search(value);
    if (!res) return;
    const results = res?.data;
    console.log('results', results);
    setOptions(
      results.map((c) => ({
        value: c.name,
        label: (
          <Link
            to={`/community/${c.slug}`}
            onClick={() => setInputValue('')}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Avatar src={c.avatarUrl} size={24} style={{ marginRight: 8 }} />
            <h4> {c.name}</h4>
          </Link>
        ),
      }))
    );
  }

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
        <AutoComplete
          options={options}
          value={inputValue}
          onChange={(val) => {
            setInputValue(val);
            searchCommunity(val);
          }}
          onSearch={searchCommunity}
        >
          <Input
            addonBefore={
              slug ? (
                <Tag
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    // navigate('/'); // Or wherever you want to reset
                  }}
                >
                  r/{slug}
                </Tag>
              ) : null
            }
            allowClear
            placeholder={slug ? `Search in ${slug}` : 'Search Communities'}
            value={inputValue}
          />
        </AutoComplete>
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
