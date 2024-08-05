import React from 'react';
import WebsiteNavbar from '../common/WebsiteNavbar';
import WebsiteFooter from '../common/WebsiteFooter';
import { Outlet } from 'react-router-dom';

const WebsiteLayout = () => {
  return (
    <>
      <WebsiteNavbar />
      <main>
        <Outlet />
      </main>
      <WebsiteFooter />
    </>
  );
};

export default WebsiteLayout;