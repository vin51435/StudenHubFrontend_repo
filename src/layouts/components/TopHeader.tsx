import { GoBellFill } from 'react-icons/go';
import { FaUser, FaUserEdit } from 'react-icons/fa';
import { IoLogOutSharp, IoChatbubbleEllipsesOutline, IoClose } from 'react-icons/io5';
import { AutoComplete, Avatar, Badge, Dropdown, Input, Tag, Tooltip } from 'antd';
import { useThemeMode } from '@src/theme/ThemeProvider';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ThemeToggle from '@src/components/themeToggle';
import { useLogout } from '@src/hooks/useLogout';
import CommunityOp from '@src/api/communityOperations';
import { matchRoute } from '@src/utils/common';
import { getExactRoutePath, getRoutePath } from '@src/utils/getRoutePath';
import { useAppDispatch, useAppSelector } from '@src/redux/hook';
import { fetchInitialPosts } from '@src/redux/reducers/cache/post.thunks';
import { appendRecentSearch, clearRecentSearches } from '@src/redux/reducers/cache/recents.slice';

const TopHeader = () => {
  const [options, setOptions] = useState<{ value: string; label: React.ReactNode }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [enableSearch, setEnableSearch] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const user = useAppSelector((state) => state.auth.user);
  const recentSearches = useAppSelector((state) => state.recentStore.searches);
  const { newMessage: newMessageNotifications } = useAppSelector(
    (state) => state.notification.notifications
  );
  const { slug } = useParams<{ slug: string }>();
  const communityCache = useAppSelector((state) => state.communityCache.cache);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { themeMode } = useThemeMode();
  const logout = useLogout();

  useEffect(() => {
    if (slug) {
      setInputValue('');
      dispatch(appendRecentSearch({ string: slug, id: `${Date.now()}`, type: 'community' }));
      const matchSlug = matchRoute(getExactRoutePath('COMMUNITY'), pathname);
      if (matchSlug === slug) {
        CommunityOp.setCommunitySlug(slug);
      }
    }

    if (
      pathname === getRoutePath('APP') ||
      pathname === getRoutePath('POPULAR') ||
      pathname === getRoutePath('COMMUNITY')
    ) {
      setEnableSearch(true);
    } else {
      setEnableSearch(false);
    }
  }, [slug]);

  async function searchCommunity(value: string, searchInCommunity?: string) {
    setLoading(true);
    setInputValue(value);
    const res = await CommunityOp.search(value);
    if (!res) return;
    const results = res?.data;

    setOptions(
      results.map((c) => ({
        value: c.name,
        label: (
          <Link
            to={getRoutePath('COMMUNITY').replace(':slug', c.slug)}
            onClick={() => setInputValue('')}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Avatar src={c.avatarUrl} size={24} style={{ marginRight: 8 }} />
            <h4> {c.name}</h4>
          </Link>
        ),
      }))
    );

    setLoading(false);
  }

  const searchInsideCommunity = (val: string) => {
    if (!slug || !communityCache) return;
    dispatch(
      fetchInitialPosts({
        communityId: communityCache._id,
        sort: 'Top',
        range: 'all',
        searchValue: val,
      })
    );
  };

  const recentSearchOptions = useMemo(
    () =>
      recentSearches.map((s) => ({
        value: s.string,
        label: (
          <div className="flex justify-between items-center px-2">
            <span
              onClick={() => {
                setInputValue(s.string);
                searchInsideCommunity(s.string);
              }}
              className="cursor-pointer truncate"
            >
              {s.string}
            </span>
            <IoClose
              onClick={(e) => {
                e.stopPropagation();
                dispatch(clearRecentSearches(s.string));
              }}
              className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer text-xs"
            />
          </div>
        ),
      })),
    [recentSearches]
  );

  const menuItems = [
    {
      key: '1',
      icon: <FaUserEdit />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: '2',
      icon: <IoLogOutSharp />,
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

  const unreadCount = newMessageNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex items-center gap-6 ml-auto w-full h-full space-between align-center">
      <div
        className="text-2xl !px-4 flex justify-center items-center my-3 cursor-pointer"
        onClick={() => navigate(getExactRoutePath('APP'))}
      >
        StudenHub
      </div>

      <div className="top-header_search w-full h-full flex items-center justify-center">
        <AutoComplete
          className="rounded-2xl flex items-center justify-center"
          style={{ width: '80%', height: '70%' }}
          options={options.length && inputValue ? options : recentSearchOptions}
          value={inputValue}
          disabled={!enableSearch}
          onChange={(val) => {
            setInputValue(val);
            if (!slug) {
              // Search Community
              searchCommunity(val);
              return;
            }
          }}
          onSearch={(val) => {
            // Search Community
            if (!slug) {
              searchCommunity(val);
              return;
            }
            // Search in Community
            searchInsideCommunity(val);
          }}
        >
          <Input
            className="w-full !h-[90%] flex items-center"
            style={{ borderRadius: '999px', height: '100%', width: '100%' }}
            disabled={!enableSearch}
            addonBefore={
              slug ? (
                <Tag
                  closable
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate(getRoutePath('COMMUNITY').replace(':slug', slug));
                  }}
                  onClose={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate(getRoutePath('APP'));
                  }}
                >
                  r/{slug}
                </Tag>
              ) : null
            }
            allowClear
            placeholder={enableSearch ? (slug ? `Search in ${slug}` : 'Search Communities') : ''}
            value={inputValue}
          />
        </AutoComplete>
      </div>

      <div className="flex items-center gap-4">
        {/* Chat */}
        <Tooltip title={'Chat'}>
          <Link className="!text-inherit flex" to={getExactRoutePath('CHATS')}>
            <Badge
              className={`menu-label_badge my-auto`}
              count={unreadCount}
              color="red"
              size="small"
            >
              <IoChatbubbleEllipsesOutline size={24} />
            </Badge>
          </Link>
        </Tooltip>

        {/* Theme Switch */}
        <Tooltip title={themeMode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}>
          <div className="flex">
            <ThemeToggle className="my-auto" />
          </div>
        </Tooltip>

        {/* Notification Bell */}
        <Tooltip title="Notifications">
          <div className="flex">
            <Badge count={unreadCount} size="small">
              <GoBellFill size={24} className="cursor-pointer" />
            </Badge>
          </div>
        </Tooltip>

        {/* User Avatar */}
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <div className="flex">
            <Avatar
              size={24}
              className="cursor-pointer"
              icon={<FaUser />}
              src={user?.profilePicture}
            />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default TopHeader;
