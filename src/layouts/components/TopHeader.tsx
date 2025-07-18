import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AutoComplete, Avatar, Badge, Dropdown, Input, Tag, Tooltip } from 'antd';
import { useThemeMode } from '@src/theme/ThemeProvider';
import { useLogout } from '@src/hooks/useLogout';
import CommunityOp from '@src/api/communityOperations';
import { matchRoute, withQuery } from '@src/utils/common';
import { getExactRoutePath, getRoutePath } from '@src/utils/getRoutePath';
import { useAppDispatch, useAppSelector } from '@src/redux/hook';
import { fetchInitialPosts } from '@src/redux/reducers/cache/post.thunks';
import { appendRecentSearch, clearRecentSearches } from '@src/redux/reducers/cache/recents.slice';
import ThemeToggle from '@src/components/themeToggle';
import { GoBellFill } from 'react-icons/go';
import { FaUserEdit, FaUser } from 'react-icons/fa';
import { IoClose, IoLogOutSharp, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { BaseOptionType, DefaultOptionType } from 'antd/es/select';
import UserOp from '@src/api/userOperations';

const TopHeader = () => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
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

  const normalSearch = async (val: string) => {
    setLoading(true);
    setInputValue(val);

    const communityPromise = CommunityOp.search(val);
    const userPromise = UserOp._searchUser(val, 1);

    const [communityResult, userResult] = await Promise.allSettled([communityPromise, userPromise]);

    const newOptions: DefaultOptionType[] = [];

    // Community results
    if (communityResult.status === 'fulfilled' && communityResult.value?.data?.length) {
      const communityOptions: DefaultOptionType[] = communityResult.value.data.map((c: any) => ({
        value: `r/${c.name}`,
        label: (
          <Link
            to={getRoutePath('COMMUNITY').replace(':slug', c.slug)}
            onClick={() => setInputValue('')}
            className="flex items-center"
          >
            <Avatar src={c.avatarUrl} size={24} className="" />
            <span className="!ml-1">r/{c.name}</span>
          </Link>
        ),
      }));

      newOptions.push({
        label: <span className="text-xs text-gray-500">Communities</span>,
        options: communityOptions,
      });
    }

    // User results
    if (userResult.status === 'fulfilled' && userResult.value?.data?.length) {
      const userOptions: DefaultOptionType[] = userResult.value.data.map((u: any) => ({
        value: `u/${u.username}`,
        label: (
          <Link
            to={getRoutePath('USER_PROFILE').replace(':username', u.username)}
            onClick={() => setInputValue('')}
            className="flex items-center"
          >
            <Avatar src={u.profilePicture} size={24} className="" />
            <span className="!ml-1">u/{u.username}</span>
          </Link>
        ),
      }));

      newOptions.push({
        label: <span className="text-xs text-gray-500">Users</span>,
        options: userOptions,
      });
    }

    setOptions(newOptions);
    setLoading(false);
  };

  const recentSearchOptions = useMemo(
    () =>
      recentSearches.map((s) => ({
        value: s.string,
        label: (
          <div className="flex items-center justify-between px-2">
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
              className="ml-2 cursor-pointer text-xs text-gray-400 hover:text-red-500"
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
    <div className="ml-auto flex h-full w-full items-center gap-6">
      <div
        className="my-3 flex cursor-pointer items-center justify-center !px-4 text-2xl"
        onClick={() => navigate(getExactRoutePath('APP'))}
      >
        StudenHub
      </div>

      <div className="top-header_search flex h-full w-full items-center justify-center">
        <AutoComplete
          className="flex items-center justify-center rounded-2xl"
          style={{ width: '80%', height: '70%' }}
          options={
            options.length && inputValue ? options : (recentSearchOptions as DefaultOptionType[])
          }
          value={inputValue}
          // disabled={!enableSearch}
          onChange={(val: string) => {
            setInputValue(val);
            if (!slug) normalSearch(val);
          }}
          onSearch={(val: string) => (!slug ? normalSearch(val) : searchInsideCommunity(val))}
        >
          <Input
            className="!h-[90%] w-full"
            style={{ borderRadius: '999px' }}
            // disabled={!enableSearch}
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
                  r/{slug}dfs
                </Tag>
              )
            }
            allowClear
            placeholder={slug ? `Search in ${slug}` : 'Search Communities'}
            value={inputValue}
            onPressEnter={(e) => {
              e.preventDefault();
              const value = (e.target as HTMLInputElement).value.trim();
              if (!value.trim()) return;
              navigate(withQuery(getRoutePath('SEARCH'), { query: value.trim() }));
            }}
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
