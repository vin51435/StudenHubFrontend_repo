import React, { useEffect, useState } from 'react';
import { Button, Layout, Menu, MenuProps, theme } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '@src/components/themeToggle';
import sidebarMenuItems, { MenuItem } from '@src/config/menuItems';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import TopHeader from '@src/layouts/components/TopHeader';
import { getRouteDetails } from '@src/utils/getRoutePath';
import { SocketProvider } from '@src/contexts/Socket.context';
import { searchArrayNestedObjByKey } from '@src/utils/common';

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  // overflow: 'auto',
  height: '100%',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const toggleButtonStyle: React.CSSProperties = {
  fontSize: '16px',
  position: 'absolute',
  top: '30px',
  left: '90%',
  backgroundColor: 'white',
  padding: '0px',
  margin: '0px',
};

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [routeDetails, setRouteDetails] = useState({});
  const [selectedKey, setSelectedKey] = useState<string | null>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setSelectedMenu();

    const routeDetails = getRouteDetails({ path: location.pathname });
    document.title = `StudenHub ${routeDetails?.title ? `| ${routeDetails?.title}` : ''}`;
    setRouteDetails(routeDetails ?? {});
  }, [location]);

  function setSelectedMenu() {
    setSelectedKey(() => {
      return (
        searchArrayNestedObjByKey(
          sidebarMenuItems,
          'path',
          location.pathname,
          'children'
        )?.key?.toString() || ''
      );
    });
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const item = searchArrayNestedObjByKey(sidebarMenuItems, 'key', e.key, 'children');
    if (item?.path) {
      navigate(item.path);
    }
  };

  return (
    <SocketProvider>
      <Layout className="h-full">
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
          <div className="!ml-auto !mr-3 h-full w-full">
            <TopHeader />
          </div>
        </Header>
        <Layout hasSider className="overflow-auto h-full sticky">
          <section style={siderStyle} className="relative">
            <Sider style={siderStyle} trigger={null} collapsible collapsed={collapsed}>
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={selectedKey ? [selectedKey] : []}
                onClick={handleMenuClick}
                items={sidebarMenuItems}
              />
            </Sider>

            <Button
              className="absolute top-2 left-2 z-10"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={toggleButtonStyle}
            />
          </section>
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
              {[...Array(10)].map((_, i) => (
                <p key={i}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
                  Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh
                  elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed
                  augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent
                  taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                </p>
              ))}
            </div>
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}>
          StudenHub ©{new Date().getFullYear()} Created by VIN
        </Footer> */}
        </Layout>
      </Layout>
    </SocketProvider>
  );
};

export default App;
