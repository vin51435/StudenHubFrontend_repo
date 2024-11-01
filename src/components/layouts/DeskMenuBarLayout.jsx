import React, { useEffect, useRef, useState } from 'react';
import { FaHome, FaSearch, FaPaperPlane, FaUserCircle, FaBell } from 'react-icons/fa';
import { GrTest } from "react-icons/gr";
import { Link, Outlet } from 'react-router-dom';
import DeskSearch from './components/DeskSearch';
import { useSelector } from 'react-redux';
const SocketProvider = React.lazy(() => import('@src/components/context/SocketContext.jsx'));

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
          <Link to={'/home'} className="menu-button">
            <span className='icon'>
              <FaHome />
            </span>
            <span className='title'>Explore</span>
          </Link>
          <div ref={searchBarRef} >
            <div className="menu-button" onClick={toggleSearch}>
              <span className='icon '>
                <FaSearch />
              </span>
              <span className='title'>Search</span>
            </div>
            {toggle.search && (
              <div className="search-bar-container">
                <DeskSearch handleOutsideClick={handleOutsideClick} isSearch={toggle.search} />
              </div>
            )}
          </div>
          <Link to={'/inbox'} className="menu-button">
            {/* Only show new message notifications here */}
            <span className='icon inbox' data-notifications={
              Object.values(notifications).reduce((count, value) => {
                return count + value.reduce((subCount, ele) => subCount + (ele?.isRead ? 0 : 1), 0);
              }, 0)
            }>
              <FaPaperPlane />
            </span>
            <span className='title'>Inbox</span>
          </Link>
          <Link to={'/notifications'} className="menu-button">
            <span className='icon'>
              <FaBell />
            </span>
            <span className='title'>Notifications</span>
          </Link>
          <button className="menu-button">
            <span className='icon'>
              <FaUserCircle />
            </span>
            <span className='title'>Profile</span>
          </button>
          <Link to={'/test'} className="menu-button">
            <span className='icon'>
              <GrTest />
            </span>
            <span className='title'>Test</span>
          </Link>
        </aside>
        <main className='w-100 h-100'>
          <Outlet />
        </main>
      </div>
    </SocketProvider>
  );
};

export default DeskMenuBarLayout;
