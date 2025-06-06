import { LuTrendingUp, LuActivity } from 'react-icons/lu';
import { IoHomeOutline } from 'react-icons/io5';
import { PiChats } from 'react-icons/pi';
import { TbUsersGroup } from 'react-icons/tb';
import { FaPlus } from 'react-icons/fa6';
import { ModalType } from '@src/contexts/Model.context';
import { getExactRoutePath, getRoutePath } from '@src/utils/getRoutePath';
import { Badge, MenuProps, ModalProps } from 'antd';

export type MenuItem = Required<MenuProps>['items'][number] & {
  path?: string;
  children?: MenuItem[];
};

export const getSidebarMenuItems = (
  collapsed: boolean,
  openModal: (type: ModalType, props?: ModalProps) => void
): MenuItem[] => {
  return [
    {
      key: '1',
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
      key: '3',
      icon: <LuActivity />,
      label: 'Activities',
      path: '/activities',
    },
    {
      key: 'sub1',
      label: 'Communities',
      icon: <TbUsersGroup />,
      type: 'submenu',
      className: 'community-submenu',
      children: [
        {
          key: 'g1',
          icon: <FaPlus />,
          label: 'Create a Community',
          type: 'item',
          onClick: () => openModal('createCommunity', { open: true }),
        },
      ],
    },
  ];
};
