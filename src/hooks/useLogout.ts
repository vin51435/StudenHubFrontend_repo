import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { post } from '@src/libs/apiConfig';
import { logoutSuccess } from '@src/redux/reducers/auth';
import { getRoutePath } from '@src/utils/getRoutePath';

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return async () => {
    try {
      await post('USER_LOGOUT', {
        BASE_URLS: 'auth',
      });

      dispatch(logoutSuccess());
      navigate(getRoutePath('LOGIN'), {
        state: {
          from: location.pathname, // or whatever property you need
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
};
