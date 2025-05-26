import { get } from '@src/libs/apiConfig';
import { UserInfoResponse } from '@src/types';

const fetchUserInfo = async (): Promise<UserInfoResponse> => {
  const response: UserInfoResponse = await get('USER', {
    BASE_URLS: 'user',
  });
  return response;
};

export default fetchUserInfo;
