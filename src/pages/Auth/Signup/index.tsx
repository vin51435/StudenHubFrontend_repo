import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useWindowSize from '@src/hooks/useWindowSize';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Col, Spin, Divider, Row } from 'antd';
import fetchUserInfo from '@src/api/fetchUser';
import { useNotification } from '@src/contexts/NotificationContext';
import GitHubOAuth from '@src/pages/Auth/components/GithubOAuth';
import GoogleSignup from '@src/pages/Auth/components/GoogleOAuth';
import SignupForm from '@src/pages/Auth/Signup/components/SignupForm';

const { useBreakpoint } = Grid;

const Signup: React.FC = () => {
  const [showLoginService, setShowLoginService] = useState<boolean>(true);

  return (
    <div className="auth-page_main signup_page">
      <Row className="w-full min-h-screen flex h-full justify-center">
        {/* Left Column */}
        <Col xs={24} md={10} lg={8} className="left_container px-6 py-4 overflow-y-auto h-full">
          <div className="w-full max-w-lg mx-auto flex flex-col h-full justify-center">
            {/* Header */}
            <div className="w-full mb-2">
              <span className="header_style">StudenHub</span>
            </div>
            {/* Sub-header */}
            <div className="">
              <span className="sub-header_style">Create your account</span>
            </div>
            <div className="">
              <span className="body_style signup_link ">
                Have an account? <Link to="/login">Log in</Link>
              </span>
            </div>
            <div className={`${showLoginService ? '' : 'hidden'}`}>
              <div className="">
                {/* GitHub and Google OAuth */}
                <GitHubOAuth />
                <GoogleSignup />
              </div>
              <div className="my-4">
                {/* <Divider orientation="center">Or with email and password</Divider> */}
                <div className="text-divider">
                  <span>Or with email and password</span>
                </div>
              </div>
            </div>
            <div className="my-4 w-full">
              <SignupForm setShowLoginService={setShowLoginService} />
            </div>
          </div>
        </Col>

        {/* Right Column (Image Section) */}
        <Col xs={0} md={14} lg={16} className="right_container hidden md:block">
          <div className="auth-page_main_img">
            {/* Add your image or content here */}
            image
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Signup;
