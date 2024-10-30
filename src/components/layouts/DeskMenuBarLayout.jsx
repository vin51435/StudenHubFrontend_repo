import React, { useEffect, useRef, useState } from 'react';
import { FaHome, FaSearch, FaPaperPlane, FaUserCircle, FaBell } from 'react-icons/fa';
import { GrTest } from "react-icons/gr";
import { Link, Outlet } from 'react-router-dom';
import DeskSearch from './components/DeskSearch';
const SocketProvider = React.lazy(() => import('@src/components/context/SocketContext.jsx'));

const DeskMenuBarLayout = () => {
  const [toggle, setToggle] = useState({ search: false });
  const searchBarRef = useRef(null);

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
            <FaHome />
            <span>Explore</span>
          </Link>
          <button className="menu-button" onClick={toggleSearch}>
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
        {toggle.search && (
          <div ref={searchBarRef} className="search-bar-container">
            <DeskSearch handleOutsideClick={handleOutsideClick} />
          </div>
        )}
      </div>
    </SocketProvider>
  );
};

export default DeskMenuBarLayout;
