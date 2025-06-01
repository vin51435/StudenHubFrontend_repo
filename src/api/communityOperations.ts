import { searchModel } from '@src/api/searchModel';
import { get, patch, post } from '@src/libs/apiConfig';
import { CENTER_ENDPOINTS } from '@src/libs/apiEndpoints';
import { IPaginationRequestQueries } from '@src/types';
import { ICommunity, IPost } from '@src/types/app';
import { PostSortOption, TimeRangeOption } from '@src/types/contants';
import { debounceAsync } from '@src/utils/debounceApiWrappe';

class CommunityOp {
  private static communityId: string | null = null;
  private static communitySlug: string | null = null;
  private static communityDetails: ICommunity | null = null;

  static readonly view = {
    get communityId() {
      return CommunityOp.communityId;
    },
    get communitySlug() {
      return CommunityOp.communitySlug;
    },
    get communityDetails() {
      return CommunityOp.communityDetails;
    },
  };

  static async _search(search: string, searchTerm: IPaginationRequestQueries = {}) {
    if (!search.trim()) return null;

    const defaultSearchTerm: IPaginationRequestQueries = {
      ...searchTerm,
      searchValue: search,
    };

    const res = await searchModel<ICommunity>('center', 'COMMUNITY', defaultSearchTerm);
    return res;
  }

  static async fetchCommunityDetails(communitySlug?: string) {
    if (!communitySlug) {
      if (!this.communitySlug) {
        return null;
      }
      communitySlug = this.communitySlug!;
    }
    const res = await get<ICommunity>(CENTER_ENDPOINTS.COMMUNITY_BY_SLUG(communitySlug), {
      BASE_URLS: 'center',
    });
    if (!communitySlug) {
      this.communityDetails = res?.data ?? null;
    }
    return res;
  }

  static setCommunitySlug(slug?: string) {
    if (!slug) {
      this.communityId = null;
      return;
    }
    this.communityId = slug;
    this.fetchCommunityDetails(slug);
  }

  static async getAllPosts(
    communityId: string,
    page: string,
    sort?: PostSortOption,
    range?: TimeRangeOption
  ) {
    if (!communityId) {
      if (!this.communityId) {
        console.error('missing communityId');
      }
      communityId = this.communityId!;
    }

    const res = await searchModel<IPost>('center', CENTER_ENDPOINTS.COMMUNITY_POSTS(communityId), {
      page,
      sortField: sort,
      range,
      pageSize: '10',
      // selectFields: 'authorId',
    });
    return res || [];
  }

  static async getPost(postId: string, communityId: string) {
    if (!communityId) {
      if (!this.communityId) {
        console.error('missing communityId');
      }
      communityId = this.communityId!;
    }
    if (!postId) return [];
    const res = await searchModel<ICommunity>(
      'center',
      CENTER_ENDPOINTS.COMMUNITY_POST(communityId, postId),
      {}
    );
    return res;
  }

  static async _followToggle(communityId?: string) {
    if (!communityId) {
      if (!this.communityId) return null;
      communityId = this.communityId;
    }
    const res = await patch(CENTER_ENDPOINTS.COMMUNITY_FOLLOW_TOGGLE(communityId), {
      BASE_URLS: 'center',
    });
    return res;
  }

  static async createPost(data: FormData, communityId?: string) {
    if (!communityId) {
      if (!this.communityId) return null;
      communityId = this.communityId;
    }
    const res = await post<ICommunity>(CENTER_ENDPOINTS.COMMUNITY_POST(communityId), {
      BASE_URLS: 'center',
      data,
      bodyType: 'form-data',
    });
    return res;
  }

  // Debounced version
  static search = debounceAsync(CommunityOp._search.bind(CommunityOp), 400);
  static followToggle = debounceAsync(CommunityOp._followToggle.bind(CommunityOp), 400);
}

export default CommunityOp;
