import { searchModel } from '@src/api/searchModel';
import { get, patch } from '@src/libs/apiConfig';
import { CENTER_ENDPOINTS } from '@src/libs/apiEndpoints';
import { IPaginationRequestQueries } from '@src/types';
import { ICommunity } from '@src/types/app';
import { debounceAsync } from '@src/utils/debounceApiWrappe';

class UserOp {
  private static followedCommunity: ICommunity[] | null = null;

  static readonly view = {
    get followedCommunity() {
      return UserOp.followedCommunity;
    },
  };

  static async fetchFollowedCommunity(id: string | undefined = undefined) {
    const res = await searchModel<ICommunity>('center', CENTER_ENDPOINTS.COMMUNITY_FOLLOWS(id), {});

    UserOp.followedCommunity = res.data ?? null;
    return res;
  }
}

export default UserOp;
