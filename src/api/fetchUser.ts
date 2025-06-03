import { get } from '@src/libs/apiConfig';
import { IUser } from '@src/types/app';

const fetchUserInfo = async (): Promise<IUser> => {
  const response: IUser = await get('USER', {
    BASE_URLS: 'user',
  });
  return response;
};

export default fetchUserInfo;
