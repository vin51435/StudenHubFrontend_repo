import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { post } from '@src/libs/apiConfig';
import { logoutSuccess } from '@src/redux/reducers/auth';
import { getRoutePath } from '@src/utils/getRoutePath';
import { setLoading } from '@src/redux/reducers/uiSlice';
import { startTransition } from 'react';

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return async () => {
    dispatch(setLoading(true));
    try {
      await post('USER_LOGOUT', {
        BASE_URLS: 'auth',
      });

      dispatch(logoutSuccess());

      // ✅ wrap navigate in transition
      startTransition(() => {
        navigate(getRoutePath('LOGIN'), {
          state: {
            from: location.pathname,
          },
        });
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};
