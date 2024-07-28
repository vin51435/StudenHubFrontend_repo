import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import GitHubOAuth from '@src/components/authComponents/authButtons/GitHubOAuth';
import GoogleSignup from '@src/components/authComponents/authButtons/GoogleOAuth';
import useWindowSize from '@src/hooks/useWindowSize';
import SignupForm from '@src/components/authComponents/SignupForm';
import { useDispatch, useSelector } from 'react-redux';
import fetchUserInfo from '@src/utils/fetchUserInfo';

const Signup = () => {
  const windowSize = useWindowSize();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    } else if (!isAuthenticated && user !== null && Object.keys(user).length === 0 && token !== null) {
      fetchUserInfo(dispatch);
    }

  }, [isAuthenticated]);

  return (
    <div className='auth-page_main signup_page'>
      <Row className='gx-0 h-100'>
        <Col xs={12} className={`top_container ${windowSize.medium ? 'd-block' : 'd-none'}`}>
          <div>
            <p>Know about StudenHub-</p>
          </div>
        </Col>
        <Col xs={12} md='5' lg='4' className='left_container' >
          <div className='w-100 my-2'>
            <div className='header_style'>StudenHub</div>
          </div>
          <div className='w-100 by-2'>
            <span className='sub-header_style'>Create your account</span>
            <br />
            <span className='body_style signup_link'>Have an account? <Link to='/login'>Log in</Link></span>
          </div>
          <div className='w-100 my-2'>
            <GitHubOAuth />
            <GoogleSignup />
          </div>
          <div className='w-100 my-0 my-sm-2'>
            <div className='w-100 text-divider'>
              <span >Or with email and password</span>
            </div>
          </div>
          <div className='w-100 my-2 '>
            <SignupForm />
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