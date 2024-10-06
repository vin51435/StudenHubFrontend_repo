import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GitHubOAuth from '@src/components/authComponents/authButtons/GitHubOAuth';
import GoogleSignup from '@src/components/authComponents/authButtons/GoogleOAuth';
import useWindowSize from '@src/hooks/useWindowSize';
import SignupForm from '@src/components/authComponents/SignupForm';
import { useDispatch, useSelector } from 'react-redux';
import fetchUserInfo from '@src/utils/fetchUserInfo';

const Signup = () => {
  const [loader, setLoader] = useState(true);
  const windowSize = useWindowSize();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);
      navigate('/signup');
    }, 10000);

    const handleAuthCheck = () => {
      const isLoginPath = pathname === '/signup'; // Exactly matches '/signup'
      const isGoogleCallback = pathname === '/signup/auth/google/callback'; // Specifically check for Google OAuth callback
      const isGithubCallback = pathname === '/signup/auth/github/callback'; // Specifically check for GitHub OAuth callback
      const isOAuthCallback = isGoogleCallback || isGithubCallback; // Check for either Google or GitHub callback

      const isAuthPath = pathname.startsWith('/signup/auth') && !isOAuthCallback; // Allow '/signup/auth' but exclude OAuth callbacks

      // Allow query parameters for OAuth callbacks
      const hasQueryOrParam = search && !isOAuthCallback; // Ignore query params for OAuth callbacks
      const hasAdditionalSegments = pathname.split('/').length > 3 && !isOAuthCallback; // Ignore path segments for OAuth callbacks

      // Check for invalid paths or parameters
      if ((hasQueryOrParam || hasAdditionalSegments) || (!isAuthPath && !isLoginPath && !isOAuthCallback)) {
        navigate('/login');
        return; // Exit early if invalid path
      }

      if (pathname === '/signup') {
        fetchUserInfo(dispatch)
          .then(response => {
            if (response.data && response.redirectUrl) {
              navigate(response.redirectUrl, { replace: true });
            }
          })
          .catch(() => console.error('Error signing up'))
          .finally(() => setLoader(false));
      } else {
        setLoader(false); // Stop loader if the condition is not met
      }
    };

    handleAuthCheck();

    return () => clearTimeout(timer); // Cleanup the timer
  }, [dispatch, pathname, search, hash, navigate]);

  const setLoaderFnc = (bool) => {
    setLoader(bool);
  };

  return (
    <div className='auth-page_main signup_page'>
      {loader && <PageLoadingSpinner />}
      <Row className='gx-0 vh-100 d-flex'>
        <Col xs={12} className={`top_container ${windowSize.medium ? 'd-block' : 'd-none'}`}>
          <div>
            <p>Know about StudenHub-</p>
          </div>
        </Col>
        <Col xs={12} md='5' lg='4' className='left_container overflow-y-auto' >
          <div className='m-auto w-100' style={{ maxWidth: '800px' }}>
            <div className='w-100 my-2'>
              <div className='header_style'>StudenHub</div>
            </div>
            <div className='w-100 by-2'>
              <span className='sub-header_style'>Create your account</span>
              <br />
              <span className='body_style signup_link'>Have an account? <Link to='/login'>Log in</Link></span>
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
              <SignupForm />
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

export default Signup;