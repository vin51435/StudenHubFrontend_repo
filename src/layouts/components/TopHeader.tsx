import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AutoComplete, Avatar, Badge, Dropdown, Input, Tag, Tooltip } from 'antd';
import { useThemeMode } from '@src/theme/ThemeProvider';
import { useLogout } from '@src/hooks/useLogout';
import CommunityOp from '@src/api/communityOperations';
import { matchRoute } from '@src/utils/common';
import { getExactRoutePath, getRoutePath } from '@src/utils/getRoutePath';
import { useAppDispatch, useAppSelector } from '@src/redux/hook';
import { fetchInitialPosts } from '@src/redux/reducers/cache/post.thunks';
import { appendRecentSearch, clearRecentSearches } from '@src/redux/reducers/cache/recents.slice';
import ThemeToggle from '@src/components/themeToggle';
import { GoBellFill } from 'react-icons/go';
import { FaUserEdit, FaUser } from 'react-icons/fa';
import { IoClose, IoLogOutSharp, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { BaseOptionType, OptionProps } from 'antd/es/select';

const TopHeader = () => {
  const [options, setOptions] = useState<BaseOptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [enableSearch, setEnableSearch] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const user = useAppSelector((state) => state.auth.user)!;
  const recentSearches = useAppSelector((state) => state.recentStore.searches);
  const { newMessage: newMessageNotifications } = useAppSelector(
    (state) => state.notification.notifications
  );
  const { slug } = useParams();
  const communityCache = useAppSelector((state) => state.communityCache.cache);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { themeMode } = useThemeMode();
  const logout = useLogout();

  const unreadCount = newMessageNotifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (slug) {
      setInputValue('');
      dispatch(appendRecentSearch({ string: slug, id: `${Date.now()}`, type: 'community' }));
      if (matchRoute(getExactRoutePath('COMMUNITY'), pathname) === slug) {
        CommunityOp.setCommunitySlug(slug);
      }
    }
    setEnableSearch(
      [getRoutePath('APP'), getRoutePath('POPULAR'), getRoutePath('COMMUNITY')].includes(pathname)
    );
  }, [slug, pathname]);

  const searchCommunity = async (value: string) => {
    setLoading(true);
    setInputValue(value);
    const res = await CommunityOp.search(value);
    if (!res) return;
    setOptions(
      res.data.map((c) => ({
        value: c.name,
        label: (
          <Link
            to={getRoutePath('COMMUNITY').replace(':slug', c.slug)}
            onClick={() => setInputValue('')}
            className="flex items-center w-full"
          >
            <span className="mr-2">
              <Avatar src={c.avatarUrl} size={24} className="mr-2" />
            </span>
            <h4 className="truncate !m-0">{c.name}</h4>
          </Link>
        ),
      }))
    );
    setLoading(false);
  };

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
      onClick: () => navigate(getRoutePath('USER_PROFILE').replace(':username', user?.username)),
      label: 'Profile',
    },
    {
      key: '2',
      icon: <IoLogOutSharp />,
      onClick: logout,
      label: 'Logout',
    },
  ];

  return (
    <div className="flex items-center gap-6 ml-auto w-full h-full">
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
          onChange={(val: string) => {
            setInputValue(val);
            if (!slug) searchCommunity(val);
          }}
          onSearch={(val: string) => (!slug ? searchCommunity(val) : searchInsideCommunity(val))}
        >
          <Input
            className="w-full !h-[90%]"
            style={{ borderRadius: '999px' }}
            disabled={!enableSearch}
            addonBefore={
              slug && (
                <Tag
                  closable
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(getRoutePath('COMMUNITY').replace(':slug', slug));
                  }}
                  onClose={(e) => {
                    e.stopPropagation();
                    navigate(getRoutePath('APP'));
                  }}
                >
                  r/{slug}
                </Tag>
              )
            }
            allowClear
            placeholder={slug ? `Search in ${slug}` : 'Search Communities'}
            value={inputValue}
          />
        </AutoComplete>
      </div>

      <div className="flex items-center gap-4">
        <Tooltip title="Chat">
          <Link className="flex" to={getExactRoutePath('CHATS')}>
            <Badge count={unreadCount} color="red" size="small">
              <IoChatbubbleEllipsesOutline size={24} />
            </Badge>
          </Link>
        </Tooltip>

        <Tooltip title={themeMode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}>
          <ThemeToggle className="my-auto" />
        </Tooltip>

        <Tooltip title="Notifications">
          <Badge count={unreadCount} size="small">
            <GoBellFill size={24} className="cursor-pointer" />
          </Badge>
        </Tooltip>

        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <Avatar
            size={24}
            className="cursor-pointer"
            icon={<FaUser />}
            src={user?.profilePicture}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default TopHeader;
