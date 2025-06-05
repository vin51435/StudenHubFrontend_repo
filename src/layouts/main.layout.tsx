import { RiMenuUnfold3Fill, RiMenuUnfold4Fill } from 'react-icons/ri';
import React, { useEffect, useState } from 'react';
import { Button, Layout, Menu, MenuProps, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getSidebarMenuItems } from '@src/config/menuItems';
import TopHeader from '@src/layouts/components/TopHeader';
import { getRouteDetails } from '@src/utils/getRoutePath';
import { searchArrayNestedObjByKey } from '@src/utils/common';
import { useModal } from '@src/contexts/Model.context';

const { Header, Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  // overflow: 'auto',
  height: '100%',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
  backgroundColor: 'transparent',
};

const toggleButtonStyle: React.CSSProperties = {
  marginTop: '4px',
};

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [routeDetails, setRouteDetails] = useState({});
  const [selectedKey, setSelectedKey] = useState<string | null>();

  const { openModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = getSidebarMenuItems(collapsed, openModal);

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
          menuItems,
          'path',
          location.pathname,
          'children'
        )?.key?.toString() || ''
      );
    });
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const item = searchArrayNestedObjByKey(menuItems, 'key', e.key, 'children');
    if (item?.path) {
      navigate(item.path);
    }
  };

  return (
    <Layout
      id="Main-layout"
      className="layout-main_container h-full bg-transparent dark:bg-transparent"
    >
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: 0,
        }}
        className="layout_header"
      >
        <div className="!ml-auto !mr-3 h-full w-full">
          <TopHeader />
        </div>
      </Header>
      <Layout hasSider className="overflow-auto h-full sticky bg-white">
        <section
          style={siderStyle}
          className="sidebar_section flex relative h-full justify-between gap-2"
        >
          <Sider
            style={siderStyle}
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth={0}
            className="!bg-transparent"
          >
            <Menu
              className="!min-h-full !bg-transparent"
              mode="inline"
              selectedKeys={selectedKey ? [selectedKey] : []}
              onClick={handleMenuClick}
              items={menuItems}
            />
          </Sider>
          <Button
            className="absolute"
            type="text"
            icon={collapsed ? <RiMenuUnfold3Fill size={20} /> : <RiMenuUnfold4Fill size={20} />}
            onClick={() => setCollapsed(!collapsed)}
            style={toggleButtonStyle}
          />
        </section>
        <Content data-scroll-id="content" className="w-full h-full pt-2 custom-scrollbar">
          <div
            className="!h-full max-h-full min-h-full mx-auto my-0 max-w-[1120px] w-[95%] py-1 bg-transparent"
            style={{
              textAlign: 'center',
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
