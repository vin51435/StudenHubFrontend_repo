import Login from '@src/components/authComponents/LoginForm';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import GitHubOAuth from '@src/components/authComponents/authButtons/GitHubOAuth';
import GoogleSignup from '@src/components/authComponents/authButtons/GoogleOAuth';

const Auth = () => {
  return (
    <div className='auth-page_main'>
      <Row className='gx-0 h-100'>
        <Col xs={12} md='5' lg='4' className='left_container' >
          <div className='w-100 my-2'>
            <div className='header_style'>StudenHub</div>
          </div>
          <div className='w-100 my-2'>
            <span className='sub-header_style'>Log in to your account</span>
            <br />
            <span className='body_style'>Don't have an account? <a>Sign up</a></span>
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
            <Login />
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