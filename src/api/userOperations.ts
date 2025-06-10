import { searchModel } from '@src/api/searchModel';
import { get, patch } from '@src/libs/apiConfig';
import { CENTER_ENDPOINTS, USER_ENDPOINTS } from '@src/libs/apiEndpoints';
import { IPaginationRequestQueries } from '@src/types';
import { ICommunity, IPost } from '@src/types/app';
import { QueryParams } from '@src/types/post.types';
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

  static async fetchGlobalPopularFeed(queries?: Partial<QueryParams>) {
    const allQueries = { ...queries, limit: 20 };
    const res = await get<IPost[], IPaginationRequestQueries<ICommunity>>(
      USER_ENDPOINTS.GLOBAL_FEED,
      {
        BASE_URLS: 'user',
        queries: [allQueries],
      }
    );
    return res;
  }
}

export default UserOp;
