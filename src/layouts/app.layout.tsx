import React, { useEffect, useState } from 'react';
import { Button, Layout, Menu, theme } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import ThemeToggle from '@src/components/themeToggle';
import sidebarMenuItems, { MenuItem } from '@src/config/menuItems';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { HeaderRightActions } from '@src/layouts/components/HeaderRightActions';
import { getRouteDetails } from '@src/utils/getRoutePath';

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [routeDetails, setRouteDetails] = useState({});
  const [selectedKey, setSelectedKey] = useState<string | null>();
  const location = useLocation();

  useEffect(() => {
    setSelectedKey(() =>
      (sidebarMenuItems as MenuItem[])
        .find((item) => item?.path === location.pathname)
        ?.key?.toString()
    );

    const routeDetails = getRouteDetails({ path: location.pathname });
    document.title = `StudenHub ${routeDetails?.title ? `| ${routeDetails?.title}` : ''}`;
    setRouteDetails(routeDetails ?? {});
  }, [location]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout hasSider>
      <Sider style={siderStyle} trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical text-2xl text-white w-full flex justify-center items-center my-3">
          StudenHub
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
          items={
            (sidebarMenuItems as MenuItem[]).map(({ key, icon, label, path }) => ({
              key,
              icon,
              label: path ? <Link to={path}>{label}</Link> : label,
            })) as ItemType<MenuItemType>[]
          }
        />
      </Sider>
      <Layout>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div className="!ml-auto !mr-3">
            <HeaderRightActions />
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
