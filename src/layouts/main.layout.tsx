import { RiMenuUnfold3Fill, RiMenuUnfold4Fill } from 'react-icons/ri';
import React, { useEffect, useState } from 'react';
import { Button, Layout, Menu, MenuProps, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSidebarMenuItems } from '@src/config/menuItems';
import TopHeader from '@src/layouts/components/TopHeader';
import { getRouteDetails } from '@src/utils/getRoutePath';
import { searchArrayNestedObjByKey } from '@src/utils/common';
import { useModal } from '@src/contexts/Model.context';
import { localStorageUtil } from '@src/utils/localStorageUtil';
const { getSettings, setSettings } = localStorageUtil;

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
  const [collapsed, setCollapsed] = useState(getSettings().menuCollapsed);
  const [selectedKey, setSelectedKey] = useState<string | null>();

  const { openModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const menuItems = useSidebarMenuItems(collapsed, openModal);

  useEffect(() => {
    setSelectedMenu();

    const routeDetails = getRouteDetails({ path: location.pathname });
    document.title = `StudenHub ${routeDetails?.title ? `| ${routeDetails?.title}` : ''}`;
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
      className="layout-main_container  h-full bg-transparent dark:bg-transparent"
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
      <Layout hasSider className="overflow-auto h-full sticky bg-white ">
        <section
          style={siderStyle}
          className="sidebar_section pl-2 pt-2 flex relative h-full justify-between gap-2 "
        >
          <Sider
            style={siderStyle}
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth={0}
            width={250}
            className="!bg-transparent !pl-2 !pt-2 "
          >
            <Menu
              className="!min-h-full !bg-transparent !pr-1 !border-[var(--secondary-white)]"
              rootClassName="sidebar_menu"
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
            onClick={() => {
              setCollapsed(!collapsed);
              setSettings({ menuCollapsed: !collapsed });
            }}
            style={toggleButtonStyle}
          />
        </section>
        <Content
          data-scroll-id="content"
          className="layout-content_container w-full h-full pt-2 custom-scrollbar"
        >
          <div
            className="!h-full max-h-full min-h-full mx-auto my-0 max-w-[1150px] w-[95%] py-1 bg-transparent "
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
