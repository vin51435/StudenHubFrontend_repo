import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getData } from '@src/config/apiConfig';
import { loginSuccess } from '@src/redux/auth';
import { PageLoadingSpinner } from '../common/LoadingSpinner';

const OauthCallback = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCallback = async (provider, code) => {
    const baseURL = provider === 'google' ? 'googleAuthBaseURL' : 'githubAuthBaseURL';

    getData(`/callback?code=${code}`, {
      baseURL,
      queue: true,
    })
      .then((response) => {
        dispatch(loginSuccess({ token: response.token, user: response.data.user }));
        navigate('/home');
      })
      .catch(err => {
        console.error(`${provider} signup error`, err);
        navigate('/login');
      });
  };

  useEffect(() => {
    const path = location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      if (path.includes('/oauth2/google/callback')) {
        handleCallback('google', code);
      } else if (path.includes('/oauth2/github/callback')) {
        handleCallback('github', code);
      }
    }
  }, [location.pathname]);

  return <PageLoadingSpinner />;
};

export default OauthCallback;
