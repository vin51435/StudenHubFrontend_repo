import {
  HomeOutlined,
  TeamOutlined,
  BarChartOutlined,
  CloudOutlined,
  MailOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ModalType } from '@src/contexts/Model.context';
import { RootState } from '@src/redux/store';
import { groupArrayOfObjects } from '@src/utils/common';
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
      icon: <HomeOutlined />,
      path: '/home',
    },
    {
      key: '2',
      icon: <TeamOutlined />,
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
      icon: <BarChartOutlined />,
      label: 'Activities',
      path: '/activities',
    },
    {
      key: 'sub1',
      label: 'Communities',
      icon: <MailOutlined />,
      type: 'submenu',
      className: 'community-submenu',
      children: [
        {
          key: 'g1',
          icon: <PlusOutlined />,
          label: 'Create a Community',
          type: 'item',
          onClick: () => openModal('createCommunity', { open: true }),
        },
      ],
    },
  ];
};
