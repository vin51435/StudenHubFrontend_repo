import { LuTrendingUp, LuActivity } from 'react-icons/lu';
import { IoHomeOutline } from 'react-icons/io5';
import { PiChats } from 'react-icons/pi';
import { TbUsersGroup } from 'react-icons/tb';
import { FaPlus } from 'react-icons/fa6';

import { ModalType } from '@src/contexts/Model.context';
import { RootState } from '@src/redux/store';
import { getExactRoutePath } from '@src/utils/getRoutePath';
import { Badge, MenuProps, ModalProps } from 'antd';
import { useSelector } from 'react-redux';

export type MenuItem = Required<MenuProps>['items'][number] & {
  path?: string;
  children?: MenuItem[];
};

export const getSidebarMenuItems = (
  collapsed: boolean,
  openModal: (type: ModalType, props?: ModalProps) => void
): MenuItem[] => {
  const { newMessage: newMessageNotifications } = useSelector(
    (state: RootState) => state.notification.notifications
  );

  const unreadCount = newMessageNotifications.filter((n) => !n.isRead).length;

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
      path: '/home',
    },
    {
      key: '2',
      icon: <PiChats />,
      label: (
        <Badge
          className={`menu-label_badge`}
          count={unreadCount}
          color="red"
          size="small"
          offset={[10, -2]} // Shift badge near text label
        >
          Chats
        </Badge>
      ),
      path: getExactRoutePath('CHATS'),
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
