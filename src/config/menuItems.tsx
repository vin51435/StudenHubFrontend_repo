import { useEffect, useState } from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { LuTrendingUp, LuActivity } from 'react-icons/lu';
import { TbUsersGroup } from 'react-icons/tb';
import { FaPlus } from 'react-icons/fa6';
import { MenuProps, ModalProps } from 'antd';
import { getRoutePath } from '@src/utils/getRoutePath';
import UserOp from '@src/api/userOperations';
import { ModalType } from '@src/contexts/Model.context';

export type MenuItem = Required<MenuProps>['items'][number] & {
  path?: string;
  children?: MenuItem[];
};

export const useSidebarMenuItems = (
  collapsed: boolean,
  openModal: (type: ModalType, props?: ModalProps) => void
): MenuItem[] => {
  const [followedCommunities, setFollowedCommunities] = useState<{
    loading: boolean;
    data: { name: string; slug: string }[];
  }>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    UserOp.fetchFollowedCommunity().then((res) => {
      setFollowedCommunities({
        loading: false,
        data: res.data?.map((item) => ({ name: item.name, slug: item.slug })) ?? [],
      });
    });
  }, [collapsed]);

  const communityChildren: MenuItem[] = [
    {
      key: 'create-community',
      icon: <FaPlus />,
      label: 'Create a Community',
      onClick: () => openModal('createCommunity', { open: true }),
    },
    followedCommunities.loading
      ? {
          key: 'loading-communities',
          label: 'Loading...',
          disabled: true,
        }
      : followedCommunities.data.map((comm) => ({
          key: `community-${comm.slug}`,
          label: comm.name,
          path: `/c/${comm.slug}`,
        })),
  ].flat();

  return [
    {
      key: 'home',
      label: 'Home',
      icon: <IoHomeOutline />,
      path: '/home',
    },
    {
      key: 'popular',
      label: 'Popular',
      icon: <LuTrendingUp />,
      path: getRoutePath('POPULAR'),
    },
    {
      type: 'divider',
    },
    {
      key: 'activities',
      icon: <LuActivity />,
      label: 'Activities',
      path: '/activities',
    },
    {
      key: 'communities',
      label: 'Communities',
      icon: <TbUsersGroup />,
      type: 'submenu',
      className: 'community-submenu',
      children: communityChildren,
    },
  ];
};
