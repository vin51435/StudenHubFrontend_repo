import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  HomeOutlined,
  MailOutlined,
  PlusOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { getExactRoutePath } from '@src/utils/getRoutePath';
import { MenuProps } from 'antd';

export type MenuItem = Required<MenuProps>['items'][number] & {
  path?: string;
  children?: MenuItem[];
};

const sidebarMenuItems: MenuItem[] = [
  {
    key: '1',
    label: 'Home',
    icon: <HomeOutlined />,
    path: '/home',
  },
  {
    key: '2',
    icon: <TeamOutlined />,
    label: 'Chats',
    path: getExactRoutePath('CHATS'),
  },
  {
    key: '3',
    icon: <BarChartOutlined />,
    label: 'Activities',
    path: '/activities',
  },
  {
    key: '4',
    label: 'profile',
    icon: <CloudOutlined />,
    path: '/profile',
    type: 'item',
  },
  {
    key: 'sub1',
    label: 'Communities',
    icon: <MailOutlined />,
    type: 'submenu',
    className: 'community-submenu',
    children: [
      {
        icon: <PlusOutlined />,
        key: 'g1',
        label: 'Create a Community',
        type: 'item',
        onClick: () => console.log('create community'),
      },
    ],
  },
];

export default sidebarMenuItems;
