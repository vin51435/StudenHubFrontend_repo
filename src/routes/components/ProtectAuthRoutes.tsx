import fetchUserInfo from '@src/api/fetchUser';
import { useNotification } from '@src/contexts/NotificationContext';
import { setLoading } from '@src/redux/reducers/uiSlice';
import { RootState } from '@src/redux/store';
import { getRoutePath } from '@src/utils/getRoutePath';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const ProtectAuthRoutes: React.FC = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);

  const loading = useSelector((state: RootState) => state.ui.loading);
  const { isAuthenticated, redirectUrl } = useSelector((state: RootState) => state.auth);
  const { pathname, search, hash } = useLocation();
  const { notif, startRemoveNotification } = useNotification();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    Promise.all([checkIfAlreadyLoggedIn(), handleAuthCheck()])
      .catch(console.error)
      .finally(() => {
        setTimeout(() => setCheckingAuth(false), 0);
        dispatch(setLoading(false));
      });
  }, [pathname, dispatch]);

  async function checkIfAlreadyLoggedIn() {
    let notifId: string | null = null;
    const timeoutId = setTimeout(() => {
      notifId = notif('Please wait while we connect to the server...', null, {
        key: 'connecting_server',
      });
    }, 5000);

    try {
      const response = await fetchUserInfo();

      if (!response.redirectUrl) {
        await navigate(getRoutePath('APP'));
      }
    } catch (error) {
      console.error('Error signing up', error);
      // notif('Something went wrong');
    } finally {
      clearTimeout(timeoutId);
      if (notifId) startRemoveNotification(notifId);
    }
  }

  async function handleAuthCheck() {
    // Checks if the path starts with /login/... or /signup/...
    const currentPathStarts: string | null = pathname.startsWith(getRoutePath('LOGIN'))
      ? 'login'
      : 'signup';

    let isPath: boolean = false; // Checks if the path is exactly /login or /signup
    let isOAuthCallback: boolean = false; // Checks if the path is an OAuth Callback
    let isGoogleCallback: boolean = false; // Checks if the path is an Google OAuth Callback
    let isGithubCallback: boolean = false; // Checks if the path is an Github OAuth Callback

    let isAuthPath: boolean = false; // Allows SIGNUP_STARTSWITH or LOGIN_STARTSWITH but exclude OAuth callbacks

    if (currentPathStarts === 'login') {
      isPath = pathname === getRoutePath('LOGIN');
      isGoogleCallback = pathname === getRoutePath('LOGIN.CALLBACK.GOOGLE');
      isGithubCallback = pathname === getRoutePath('LOGIN.CALLBACK.GITHUB');
      isOAuthCallback = isGoogleCallback || isGithubCallback;

      isAuthPath = pathname.startsWith(getRoutePath('LOGIN.CALLBACK')) && !isOAuthCallback;
    } else {
      isPath = pathname === getRoutePath('SIGNUP');
      isGoogleCallback = pathname === getRoutePath('SIGNUP.CALLBACK.GOOGLE');
      isGithubCallback = pathname === getRoutePath('SIGNUP.CALLBACK.GITHUB');
      isOAuthCallback = isGoogleCallback || isGithubCallback;

      isAuthPath = pathname.startsWith(getRoutePath('SIGNUP.CALLBACK')) && !isOAuthCallback;
    }
    /**
     * Allow query parameters for OAuth callbacks
     *
     */
    const hasQueryOrParam = !!search && !isOAuthCallback; // Ignore query params for OAuth callbacks
    const hasAdditionalSegments = pathname.split('/').length > 3 && !isOAuthCallback; // Ignore path segments for OAuth callbacks

    // Check for invalid paths or parameters
    // if (
    //   hasQueryOrParam ||
    //   hasAdditionalSegments ||
    //   (!isAuthPath && !isPath && !isOAuthCallback)
    // ) {
    //   console.log('invalide param login', {
    //     hasQueryOrParam,
    //     search: !!search,
    //     isOAuthCallback,
    //     hasAdditionalSegments,
    //     isAuthPath,
    //     isPath,
    //     result:
    //       hasQueryOrParam ||
    //       hasAdditionalSegments ||
    //       (!isAuthPath && !isPath && !isOAuthCallback),
    //   });
    //   navigate('/login');
    //   return;
    // }

    // if (!isAuthenticated) {
    //   dispatch(setLoading(false));
    //   return;
    // }
  }

  if (checkingAuth || loading) return null;

  // ✅ If authenticated, continue to protected route
  if (!isAuthenticated || (isAuthenticated && !checkingAuth && (location.pathname === getRoutePath('SIGNUP.DETAILS') || location.pathname === getRoutePath('SIGNUP.INTERESTS')))) {
    return <Outlet />;
  }

  return null;
  // return <Navigate to={getRoutePath('LOGIN')} state={{ from: location }} replace />;
};

export default ProtectAuthRoutes;
