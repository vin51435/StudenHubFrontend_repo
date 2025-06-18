import { get, post } from '@src/libs/apiConfig';
import { AUTH_ENDPOINTS } from '@src/libs/apiEndpoints';
import { setLoading } from '@src/redux/reducers/uiSlice';
import store from '@src/redux/store';

class UserAuthOp {
  static async ManualLogin(values: { email: string; password: string }) {
    store.dispatch(setLoading(true));
    const res = await post('USER_LOGIN', {
      BASE_URLS: 'auth',
      data: values,
    });
    return res;
  }

  static async LoginGoogleCallback(code: string) {
    const res = await get(AUTH_ENDPOINTS.GOOGLE_CALLBACK, {
      BASE_URLS: 'googleAuth',
      queries: [{ code }],
    });
    return res.data;
  }

  static async LoginGithubCallback(code: string) {
    const res = await get(AUTH_ENDPOINTS.GITHUB_CALLBACK, {
      BASE_URLS: 'githubAuth',
      queries: [{ code }],
    });
    return res.data;
  }
}

export default UserAuthOp;
