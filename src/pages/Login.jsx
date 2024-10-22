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
import { useNotification } from '@src/components/context/NotificationContext';

const Auth = () => {
  const [loader, setLoader] = useState(true);
  const windowSize = useWindowSize();
  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  const { pathname, search, hash } = useLocation();
  const { notif, startRemoveNotification } = useNotification();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthCheck = () => {
      const isLoginPath = pathname === '/login'; // Exactly matches '/login'
      const isGoogleCallback = pathname === '/login/auth/google/callback'; // Specifically check for Google OAuth callback
      const isGithubCallback = pathname === '/login/auth/github/callback'; // Specifically check for GitHub OAuth callback
      const isOAuthCallback = isGoogleCallback || isGithubCallback; // Check for either Google or GitHub callback

      const isAuthPath = pathname.startsWith('/login/auth') && !isOAuthCallback; // Allow '/login/auth' but exclude OAuth callbacks

      // Allow query parameters for OAuth callbacks
      const hasQueryOrParam = search && !isOAuthCallback; // Ignore query params for OAuth callbacks
      const hasAdditionalSegments = pathname.split('/').length > 3 && !isOAuthCallback; // Ignore path segments for OAuth callbacks

      // Check for invalid paths or parameters
      if ((hasQueryOrParam || hasAdditionalSegments) || (!isAuthPath && !isLoginPath && !isOAuthCallback)) {
        navigate('/login');
        return; // Exit early if invalid path
      }

      if (!token) {
        setLoader(false);
        return;
      };

      if (pathname === '/login') {
        let notifId = null;
        const timeoutId = setTimeout(() => {
          notifId = notif('Connecting to Server', 'Please wait while we connect to the server...', { type: 'error', timeOut: 0 });
        }, 5000);

        fetchUserInfo(dispatch)
          .then(() => {
            navigate('/home');
          })
          .catch(() => console.error('Error logging in'))
          .finally(() => {
            clearTimeout(timeoutId);
            if (notifId) {
              startRemoveNotification(notifId);
            }
            setLoader(false);
          });
      } else {
        setLoader(false);
      }
    };

    handleAuthCheck();

  }, [dispatch, pathname, search, hash, navigate]);

  const setLoaderFnc = (bool) => {
    setLoader(bool);
  };

  return (
    <div className='auth-page_main'>
      {loader && <PageLoadingSpinner />}
      <Row className='gx-0 h-100'>
        <Col xs={12} className={`top_container ${windowSize.medium ? 'd-none' : 'd-none'}`}>
          <div>
            <p>Know about StudenHub-</p>
          </div>
        </Col>
        <Col xs={12} md='5' lg='4' className='left_container' >
          <div className='m-auto w-100' style={{ maxWidth: '800px' }}>
            <div className='w-100 my-2'>
              <div className='header_style'>StudenHub</div>
            </div>
            <div className='w-100 by-2'>
              <span className='sub-header_style lh-1'>Log in to your account</span>
              <br />
              <div className='mt-1'>
                <span className='body_style signup_link'>Don't have an account? <Link to='/signup'>Sign up</Link></span>
              </div>
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
          </div>
        </Col>
        <Col xs={12} md='7' lg='8' className='right_container d-none d-md-block'>
          <div className='auth-page_main_img'>
            image
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Auth;