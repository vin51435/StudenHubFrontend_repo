import useWindowSize from '@src/hooks/useWindowSize';
import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};


const WebsiteNavbar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const [expand, updateExpanded] = useState(false);
  const { medium: windowSmall } = useWindowSize();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible = prevScrollPos > currentScrollPos;

      const toggleCheckbox = document.getElementById('nav_toggle');
      if (toggleCheckbox && toggleCheckbox.checked) {
        toggleCheckbox.checked = false;
        setTimeout(() => {
          setVisible(isVisible);
          setPrevScrollPos(currentScrollPos);
        }, 650);
      } else {
        setVisible(isVisible);
        setPrevScrollPos(currentScrollPos);
      }
    };

    let delay;
    if (windowSmall) {
      delay = 40;
    } else {
      delay = 0;
    }
    const debouncedHandleScroll = debounce(handleScroll, delay);
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [prevScrollPos]);

  return (
    <>
      {windowSmall ?
        <div className={`mobile-nav_container`} id="navbar" style={{
          top: visible ? '0' : '-30%',
          transition: 'top 0.4s'
        }}>
          <input id="nav_toggle" type="checkbox" />
          <label className="toggle-container" htmlFor="nav_toggle">
            <span className="nav_button nav_button-toggle"></span>
          </label>
          <nav className="nav">
            <a className="nav-item" href="/login">Login</a>
            <a className="nav-item" href="">Dashboard</a>
            <a className="nav-item" href="">History</a>
            <a className="nav-item" href="">Statistics</a>
            <a className="nav-item" href="">Settings</a>
          </nav>
        </div>
        :
        <Navbar
          expanded={expand}
          fixed="top"
          expand="md"
          className=''
          style={{
            top: visible ? '0' : '-30%',
            transition: 'top 0.4s'
          }}
        >
          <Container fluid='xxl'>
            <Navbar.Brand href="/" className="d-flex">
              {/* <img src={logo} className="img-fluid logo" alt="brand" /> */}
              StudenHub
            </Navbar.Brand>
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              onClick={() => {
                updateExpanded(expand ? false : "expanded");
              }}
            >
              <span></span>
              <span></span>
              <span></span>
            </Navbar.Toggle>
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ms-auto" defaultActiveKey="#home">
                <Nav.Item>
                  <Nav.Link as={Link} to="/login" onClick={() => {
                    // toggleLoading(true);
                    updateExpanded(false);
                  }}>
                    Login
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>}
    </>

  );
};

export default WebsiteNavbar;
