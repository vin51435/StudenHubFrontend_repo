import React from 'react';
import { FaHome, FaSearch, FaPaperPlane, FaUserCircle, FaBell } from 'react-icons/fa';
import { GrTest } from "react-icons/gr";
import { Link, Outlet } from 'react-router-dom';
const SocketProvider = React.lazy(() => import('@src/components/context/SocketContext.jsx'));

const DeskMenuBarLayout = () => {
  return (
    <SocketProvider>
      <div className='w-100 d-flex '>
        <aside className="menu-bar d-flex fs-6">
          <Link to={'/home'} className="menu-button">
            <FaHome />
            <span>Explore</span>
          </Link>
          <button className="menu-button">
            <FaSearch />
            <span>Search</span>
          </button>
          <Link to={'/inbox'} className="menu-button">
            <FaPaperPlane />
            <span>Inbox</span>
          </Link>
          <button className="menu-button">
            <FaUserCircle />
            <span>Profile</span>
          </button>
          <button className="menu-button">
            <FaBell />
            <span>Notifications</span>
          </button>
          <Link to={'/test'} className="menu-button">
            <GrTest />
            <span>Test</span>
          </Link>
        </aside>
        <main className='w-100 h-100'>
          <Outlet />
        </main>
      </div>
    </SocketProvider >
  );
};

export default DeskMenuBarLayout;
