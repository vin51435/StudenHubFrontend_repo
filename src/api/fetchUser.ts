import { get } from '@src/libs/apiConfig';
import { UserInfoResponse } from '@src/types';

const fetchUserInfo = async (): Promise<UserInfoResponse> => {
  try {
    const response: UserInfoResponse = await get('USER', {
      BASE_URLS: 'user',
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export default fetchUserInfo;
