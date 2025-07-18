import { searchModel } from '@src/api/searchModel';
import { get, patch, post } from '@src/libs/apiConfig';
import { CENTER_ENDPOINTS, USER_ENDPOINTS } from '@src/libs/apiEndpoints';
import { IPaginatedResponse, IPaginationRequestQueries } from '@src/types';
import { ICommunity, IPost, IUser } from '@src/types/app';
import { ICommentData } from '@src/types/post.types';

class UserOp {
  private static followedCommunity: ICommunity[] | null = null;

  static readonly view = {
    get followedCommunity() {
      return UserOp.followedCommunity;
    },
  };

  static async fetchUserInfo(identifier: string) {
    const res = await get<IUser>(USER_ENDPOINTS.USER_DETAIL(identifier), {
      BASE_URLS: 'user',
    });
    return res.data;
  }

  static async fetchFollowedCommunity(id: string | undefined = undefined) {
    const res = await searchModel<ICommunity>('center', CENTER_ENDPOINTS.COMMUNITY_FOLLOWS(id), {});

    UserOp.followedCommunity = res.data ?? null;
    return res;
  }

  static async fetchGlobalPopularFeed(queries?: Partial<IPaginationRequestQueries>) {
    const allQueries = { ...queries, limit: 20 };
    const res = await get<IPost[], IPaginatedResponse<IPost>>(USER_ENDPOINTS.GLOBAL_FEED, {
      BASE_URLS: 'user',
      queries: [allQueries],
    });
    return res;
  }

  static async followUser(userId: string) {
    const res = await patch(USER_ENDPOINTS.FOLLOW_USER(userId), {
      BASE_URLS: 'user',
    });
    return res;
  }

  static async createChat(participantId: string, chatId?: string) {
    const data: any = {
      userBId: participantId,
    };
    if (chatId) {
      data.chatId = chatId;
    }
    const res = await post<{ chatId: string; userBId: string }>(USER_ENDPOINTS.CREATE_CHAT, {
      BASE_URLS: 'user',
      data,
    });

    return res.data;
  }

  static async getPosts(page: number, id?: string) {
    const res = await get<{}, IPaginatedResponse<IPost>>(USER_ENDPOINTS.USER_POST(id), {
      BASE_URLS: 'user',
      queries: [{ page: String(page) }, { pageSize: String(10) }],
    });
    return res;
  }

  static async getSavedPosts(page: number) {
    const res = await get<{}, IPaginatedResponse<IPost>>('USER_SAVED_POSTS', {
      BASE_URLS: 'user',
      queries: [{ page: String(page) }, { pageSize: String(10) }],
    });
    return res;
  }

  static async getComments(page: number, id?: string) {
    const res = await get<{}, IPaginatedResponse<ICommentData>>(USER_ENDPOINTS.USER_COMMENTS(id), {
      BASE_URLS: 'user',
      queries: [{ page: String(page) }, { pageSize: String(10) }],
    });
    return res;
  }

  static async getUpvotedPosts(page: number) {
    const res = await get<{}, IPaginatedResponse<IPost>>('USER_UPVOTED_POSTS', {
      BASE_URLS: 'user',
      queries: [{ page: String(page) }, { pageSize: String(10) }],
    });
    return res;
  }

  static async getDownvotedPosts(page: number) {
    const res = await get<{}, IPaginatedResponse<IPost>>('USER_DOWNVOTED_POSTS', {
      BASE_URLS: 'user',
      queries: [{ page: String(page) }, { pageSize: String(10) }],
    });
    return res;
  }

  static async updateProfilePicture(data: FormData) {}
}

export default UserOp;
