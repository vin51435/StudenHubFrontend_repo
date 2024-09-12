import { getData, githubAuthBaseURL } from '@src/config/apiConfig';
import { loginSuccess } from '@src/redux/auth';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const GitHubOAuth = ({ setLoaderFnc }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLogin = async (code) => {
    const response = await getData(`/callback?code=${code}`, {
      baseURL: 'githubAuthBaseURL'
    });
    dispatch(loginSuccess({ token: response.token, user: response.data.user }));
    navigate('/home')
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/login/auth/github/callback') || path.includes('/signup/auth/github/callback')) {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        handleLogin(code);
      }
    }
  }, []);

  const btnClick = () => {
    setLoaderFnc(true);
    window.location.href = githubAuthBaseURL;
  };

  return (
    <div className='auth_btn_container my-2'>
      <button className="gsi-material-button" onClick={btnClick}>
        <div className="gsi-material-button-state"/>
        <div className="gsi-material-button-content-wrapper">
          <div className="gsi-material-button-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
              <path d="M10.008 0C4.474 0 0 4.584 0 10.254c0 4.533 2.867 8.37 6.843 9.727.498.103.68-.22.68-.492 0-.237-.017-1.052-.017-1.901-2.784.611-3.364-1.223-3.364-1.223-.447-1.188-1.11-1.493-1.11-1.493-.911-.628.067-.628.067-.628 1.01.067 1.54 1.052 1.54 1.052.895 1.562 2.337 1.12 2.917.849.083-.662.348-1.12.63-1.375-2.22-.238-4.557-1.12-4.557-5.06 0-1.12.397-2.037 1.027-2.75-.1-.254-.447-1.307.1-2.716 0 0 .845-.272 2.75 1.053a9.5 9.5 0 0 1 2.502-.34c.845 0 1.707.119 2.502.34 1.906-1.325 2.75-1.053 2.75-1.053.548 1.41.2 2.462.1 2.716.647.713 1.028 1.63 1.028 2.75 0 3.94-2.337 4.805-4.574 5.06.365.322.68.933.68 1.901 0 1.375-.017 2.479-.017 2.818 0 .272.183.595.68.493C17.133 18.623 20 14.787 20 10.254 20.016 4.584 15.526 0 10.008 0" clipRule="evenodd" fill="#24292f" fillRule="evenodd" />
            </svg>
          </div>
          <span className="gsi-material-button-contents">Github</span>
          <span style={{ display: 'none' }}>Sign in with Github</span>
        </div>
      </button >
    </div >
  );
};

export default GitHubOAuth;