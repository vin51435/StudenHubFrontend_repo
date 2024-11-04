import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const { user } = useSelector(state => state.auth);

  const toggleBurgerMenu = () => {
    setBurgerMenuOpen(!burgerMenuOpen);
  };

  return (
    <div className="nav-container">
      {/* Left Navigation */}
      <div className="left-nav">
        <div className="personal-section">
          <h2>Personal</h2>
          <ul>
            <li><Link to="/messages">Message/Inbox</Link></li>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/notifications">Notifications</Link></li>
          </ul>
        </div>
        <div className="communities-section">
          <h2>Communities</h2>
          <ul>
            <li><Link to="/community1">Community 1</Link></li>
            <li><Link to="/community2">Community 2</Link></li>
            <li><Link to="/community3">Community 3</Link></li>
          </ul>
        </div>
      </div>
      {/* Main Content */}
      <div className="main-content d-flex justify-content-center align-items-center">
        {user.email}
      </div>
      {/* Right Navigation */}
      <div className="right-nav">
        <div className="recent-posts-section">
          <h2>Recent Posts</h2>
          <ul>
            <li><Link to="/post1">Post 1</Link></li>
            <li><Link to="/post2">Post 2</Link></li>
            <li><Link to="/post3">Post 3</Link></li>
          </ul>
        </div>
        <div className="trending-posts-section">
          <h2>Trending Posts</h2>
          <ul>
            <li><Link to="/post1">Post 1</Link></li>
            <li><Link to="/post2">Post 2</Link></li>
            <li><Link to="/post3">Post 3</Link></li>
          </ul>
        </div>
      </div>
      {/* Burger Menu */}
      <div className="burger-menu">
        <button className="burger-button" onClick={toggleBurgerMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        {burgerMenuOpen && (
          <div className="burger-nav">
            {/* Navigation items will be duplicated here */}
            <ul>
              <li><Link to="/messages">Message/Inbox</Link></li>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/notifications">Notifications</Link></li>
              <li><Link to="/community1">Community 1</Link></li>
              <li><Link to="/community2">Community 2</Link></li>
              <li><Link to="/community3">Community 3</Link></li>
              <li><Link to="/post1">Post 1</Link></li>
              <li><Link to="/post2">Post 2</Link></li>
              <li><Link to="/post3">Post 3</Link></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;