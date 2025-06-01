import { searchModel } from '@src/api/searchModel';
import { get, patch, post } from '@src/libs/apiConfig';
import { CENTER_ENDPOINTS } from '@src/libs/apiEndpoints';
import { IPaginationRequestQueries } from '@src/types';
import { ICommunity, IPost } from '@src/types/app';
import { PostSortOption, TimeRangeOption } from '@src/types/contants';
import { VoteEnum } from '@src/types/enum';
import { debounceAsync } from '@src/utils/debounceApiWrappe';

class PostOp {
  static async _voteToggle(
    postId: string,
    voteType: VoteEnum = VoteEnum.upVote,
    communityId: string = 'dontmatter'
  ) {
    if (!postId) {
      return null;
    }
    const res = await post(CENTER_ENDPOINTS.POST_VOTE(postId, voteType, communityId), {
      BASE_URLS: 'center',
    });
    return res;
  }

  // Debounced version
  static voteToggle = debounceAsync(this._voteToggle.bind(this), 400);
}

export default PostOp;
