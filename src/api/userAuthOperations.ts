import { get } from '@src/libs/apiConfig';
import { AUTH_ENDPOINTS } from '@src/libs/apiEndpoints';

class UserAuthOp {
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
