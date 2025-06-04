import { useRoutes, BrowserRouter } from 'react-router-dom';
import { publicRoutes } from './routing/publicRoutes.routes';
import { protectedRoutes } from './routing/protectedRoutes.routes';
import { useEffect } from 'react';
import { authRoutes } from '@src/routes/routing/authRoutes.routes';
import { useDispatch } from 'react-redux';
import { setLoading } from '@src/redux/reducers/uiSlice';
import ScrollRestoration from '@src/components/ScrollRestoration';

const AppRoutes = () => {
  const dispatch = useDispatch();
  const routes = [...publicRoutes, ...authRoutes, ...protectedRoutes];

  const routeLoaded = useRoutes(routes);
  useEffect(() => {
    if (routeLoaded) {
      dispatch(setLoading(false));
    }
  }, [routeLoaded]);

  return routeLoaded;
};

const RouterWrapper = () => (
  <BrowserRouter>
    <ScrollRestoration />
    <AppRoutes />
  </BrowserRouter>
);

export default RouterWrapper;
