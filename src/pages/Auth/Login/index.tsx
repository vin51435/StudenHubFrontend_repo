import GitHubOAuth from '@src/pages/Auth/components/GithubOAuth';
import GoogleSignup from '@src/pages/Auth/components/GoogleOAuth';
import LoginForm from '@src/pages/Auth/Login/components/LoginForm';
import { Col, Image, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import LoginImage from '/login.png';

const Login: React.FC = () => {
  return (
    <div className="auth-page_main relative h-full">
      <Row className="h-full">
        {/* <Col span={24} className={`top_container ${windowSize.medium ? 'hidden' : 'hidden'}`}>
          <div>
            <p>Know about StudenHub-</p>
          </div>
        </Col> */}
        <Col xs={24} md={10} lg={8} className="left_container px-6 py-4 !justify-center bg">
          <div className="m-auto w-full max-w-[800px] h-full flex flex-col justify-center">
            <div className="w-full mb-2">
              <div className="header_style">StudenHub</div>
            </div>
            <div className="w-full">
              <span className="sub-header_style leading-none">Log in to your account</span>
              <br />
              <div className="my-1">
                <span className="body_style signup_link">
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </span>
              </div>
            </div>
            <div className="w-full">
              <GitHubOAuth />
              <GoogleSignup />
            </div>
            <div className="w-full my-4">
              <div className="w-full text-divider">
                <span>Or with email and password</span>
              </div>
            </div>
            <div className="w-full">
              <LoginForm />
            </div>
          </div>
        </Col>
        <Col
          xs={0}
          md={14}
          lg={16}
          className="right_container hidden md:block h-full"
          style={{
            // background:
            //   'radial-gradient(circle at top left, #003c7d, #0c67bd), radial-gradient(circle at top right, #0f71c6, transparent 70%), radial-gradient(circle at bottom left, #00a2ff, transparent 70%), radial-gradient(circle at bottom right, #b3e0ff, transparent 70%);',
            background: 'linear-gradient(to bottom right, #003c7d, #0c67bd)',
            display: 'flex',
          }}
        >
          <Image
            wrapperClassName="[&&]:m-auto"
            src={LoginImage}
            preview={false}
            className="object-cover object-left-top w-full overflow-clip "
          />
        </Col>
      </Row>
    </div>
  );
};

export default Login;
