import { get } from '@src/libs/apiConfig';
import { IUser } from '@src/types/app';

const fetchUserInfo = async () => {
  const response = await get<IUser>('USER', {
    BASE_URLS: 'user',
  });
  return response;
};

export default fetchUserInfo;
