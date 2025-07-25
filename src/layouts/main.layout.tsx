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

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(getSettings().menuCollapsed);
  const [selectedKey, setSelectedKey] = useState<string | null>();
  const [onMenuHover, setOnMenuHover] = useState(false);

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
    <Layout id="Main-layout" className="layout-main_container h-full" rootClassName="layout-">
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
        <div className="!mr-3 !ml-auto h-full w-full">
          <TopHeader />
        </div>
      </Header>
      <Layout hasSider className="layout-main-content_container sticky h-full overflow-hidden">
        <section
          style={{
            ...siderStyle,
            // position: onMenuHover ? 'absolute' : 'sticky',
            transition: 'width 0.3s',
          }}
          className="sidebar_section relative flex h-full justify-between gap-0.5 pt-2"
          // onMouseEnter={() => {
          //   if (collapsed) {
          //     setTimeout(() => setOnMenuHover(true), 500);
          //   }
          // }}
          // onMouseLeave={() => {
          //   if (collapsed) setOnMenuHover(false);
          // }}
        >
          <Sider
            style={{
              ...siderStyle,
              zIndex: 10,
              height: '100vh',
            }}
            trigger={null}
            collapsible
            collapsed={collapsed}
            // collapsed={collapsed && !onMenuHover}
            collapsedWidth={10}
            width={250}
            className="border-r-1 border-[var(--secondary-white)] !bg-[var(--white)] px-2 dark:border-[var(--secondary-dark)] dark:!bg-[var(--primary-dark)]"
          >
            <Menu
              className="!min-h-full !border-0 !bg-transparent !px-1"
              rootClassName="sidebar_menu"
              defaultOpenKeys={collapsed ? [] : ['communities']}
              mode="inline"
              selectedKeys={selectedKey ? [selectedKey] : []}
              onClick={handleMenuClick}
              items={menuItems}
            />
            <span
              className="nav_button absolute top-2 right-0 h-fit"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Button
                className="absolute"
                type="text"
                icon={collapsed ? <RiMenuUnfold3Fill size={20} /> : <RiMenuUnfold4Fill size={20} />}
                onClick={() => {
                  const newVal = !collapsed;
                  setCollapsed(newVal);
                  setSettings({ menuCollapsed: newVal });
                }}
              />
            </span>
          </Sider>
        </section>
        <Content
          data-scroll-id="content"
          className="layout-content_container custom-scrollbar ml-4 h-full w-full pt-2"
        >
          <div
            className="mx-auto my-0 !h-full max-h-full min-h-full w-[95%] max-w-[1150px] bg-transparent py-1"
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
