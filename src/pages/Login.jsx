import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Login from '@src/components/authComponents/LoginForm';
import GitHubOAuth from '@src/components/authComponents/authButtons/GitHubOAuth';
import GoogleSignup from '@src/components/authComponents/authButtons/GoogleOAuth';
import useWindowSize from '@src/hooks/useWindowSize';
import { useDispatch, useSelector } from 'react-redux';
import fetchUserInfo from '@src/utils/fetchUserInfo';
import { PageLoadingSpinner } from '@src/components/common/LoadingSpinner';

const Auth = () => {
  const [loader, setLoader] = useState(false);
  const windowSize = useWindowSize();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname;

  useEffect(() => {
    if (path.includes('/login/auth/')) {
      setLoader(true);
      const timer = setTimeout(() => {
        setLoader(false);
        console.error('Error logging in');
        navigate('/login');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [path, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    } else if (!isAuthenticated && token !== null) {
      fetchUserInfo(dispatch);
    }
  }, [isAuthenticated]);

  const setLoaderFnc = (bool) => {
    setLoader(bool);
  };

  return (
    <div className='auth-page_main'>
      {loader && <PageLoadingSpinner />}
      <Row className='gx-0 h-100'>
        <Col xs={12} className={`top_container ${windowSize.medium ? 'd-block' : 'd-none'}`}>
          <div>
            <p>Know about StudenHub-</p>
          </div>
        </Col>
        <Col xs={12} md='6' lg='4' className='left_container' >
          <div className='w-100 my-2'>
            <div className='header_style'>StudenHub</div>
          </div>
          <div className='w-100 by-2'>
            <span className='sub-header_style'>Log in to your account</span>
            <br />
            <span className='body_style signup_link'>Don't have an account? <Link to='/signup'>Sign up</Link></span>
          </div>
          <div className='w-100 my-2'>
            <GitHubOAuth setLoaderFnc={setLoaderFnc} />
            <GoogleSignup setLoaderFnc={setLoaderFnc} />
          </div>
          <div className='w-100 my-0 my-sm-2'>
            <div className='w-100 text-divider'>
              <span >Or with email and password</span>
            </div>
          </div>
          <div className='w-100 my-2 '>
            <Login />
          </div>
        </Col>
        <Col xs={12} md='6' lg='8' className='right_container d-none d-md-block'>
          <div className='auth-page_main_img'>
            image
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Auth;