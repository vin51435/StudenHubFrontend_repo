import { get } from '@src/libs/apiConfig';
import { UserInfoResponse } from '@src/types';

const fetchUserInfo = async (): Promise<UserInfoResponse> => {
  try {
    const response: UserInfoResponse = await get('USER_INFO', {
      BASE_URLS: 'auth',
      queue: true,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export default fetchUserInfo;
