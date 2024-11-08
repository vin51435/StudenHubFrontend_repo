import React, { useEffect, useRef, useState } from 'react';
import { FaHome, FaSearch, FaPaperPlane, FaUserCircle, FaBell } from 'react-icons/fa';
import { GrTest } from "react-icons/gr";
import { Link, Outlet } from 'react-router-dom';
import DeskSearch from './components/DeskSearch';
import { useSelector } from 'react-redux';
const SocketProvider = React.lazy(() => import('@src/context/SocketContext.jsx'));

const DeskMenuBarLayout = () => {
  const [toggle, setToggle] = useState({ search: false });
  const searchBarRef = useRef(null);
  const { notifications } = useSelector(state => state.notification);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  function toggleSearch() {
    setToggle((prev) => ({ ...prev, search: !prev.search }));
  };

  function handleOutsideClick(event) {
    if ((event === 'close') || (searchBarRef.current && !searchBarRef.current.contains(event.target))) {
      setToggle((prev) => {
        const newObj = { ...prev };
        Object.keys(newObj).forEach((key) => (newObj[key] = false));
        return newObj;
      });

    }
  }

  return (
    <SocketProvider>
      <div className='w-100 d-flex'>
        <aside className="menu-bar d-flex fs-6">
          <Link to={'/home'} className="menu-button tooltip right" data-tooltip={'Explore'}>
            <span className='icon '>
              <FaHome />
            </span>
          </Link>
          <div ref={searchBarRef} >
            <div className="menu-button tooltip right" data-tooltip={'Search'} onClick={toggleSearch}>
              <span className='icon'>
                <FaSearch />
              </span>
            </div>
            {toggle.search && (
              <div className="search-bar-container">
                <DeskSearch handleOutsideClick={handleOutsideClick} isSearch={toggle.search} />
              </div>
            )}
          </div>
          <Link to={'/inbox'} className="menu-button tooltip right" data-tooltip={'Inbox'}>
            {/* Only show new message notifications here */}
            <span className='icon inbox' data-notifications={
              notifications.newMessage.map((notification) => !notification.isRead).reduce((a, b) => a + b, 0)
            }>
              <FaPaperPlane />
            </span>
          </Link>
          <Link to={'/notifications'} className="menu-button tooltip right" data-tooltip={'Notifications'}>
            <span className='icon'>
              <FaBell />
            </span>
          </Link>
          <Link to={'/profile'} className="menu-button tooltip right" data-tooltip={'Profile'}>
            <span className='icon'>
              <FaUserCircle />
            </span>
          </Link>
          <Link to={'/test'} className="menu-button tooltip right" data-tooltip={'Tests'}>
            <span className='icon'>
              <GrTest />
            </span>
          </Link>
        </aside>
        <main className='w-100'>
          <Outlet />
        </main>
      </div>
    </SocketProvider >
  );
};

export default DeskMenuBarLayout;
