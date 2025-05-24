import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  HomeOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { getExactRoutePath } from '@src/utils/getRoutePath';
import { MenuProps } from 'antd';

export type MenuItem = NonNullable<MenuProps['items']>[number] & {
  path?: string;
  icon: React.ReactNode;
  label: React.ReactNode;
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
  },
];

export default sidebarMenuItems as Required<MenuProps>['items'][number][];
