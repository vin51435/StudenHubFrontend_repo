import { deleteResource, get, patch, post } from '@src/libs/apiConfig';
import { CENTER_ENDPOINTS } from '@src/libs/apiEndpoints';
import { CommentPaginatedResponse } from '@src/types';
import { IPost } from '@src/types/app';
import { VoteEnum } from '@src/types/enum';
import { ICommentData, IPostCommentDTO, ThreadQueryParams } from '@src/types/post.types';
import { debounceAsync } from '@src/utils/debounceApiWrappe';

class PostOp {
  static async fetchPost(postId: string, communityId: string = 'dosntmatter') {
    const res = await get<IPost>(CENTER_ENDPOINTS.POST(communityId, postId), {
      BASE_URLS: 'center',
    });
    return res;
  }

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

  static async deletePost(postId: string, communityId: string = 'dontmatter') {
    const res = await deleteResource(CENTER_ENDPOINTS.POST(communityId, postId), {
      BASE_URLS: 'center',
    });
    return res;
  }

  static async postComment(postId: string, data: IPostCommentDTO) {
    const res = await post(CENTER_ENDPOINTS.POST_COMMENT(postId), {
      BASE_URLS: 'comments',
      data,
    });
    return res;
  }

  static async _savePostToggle(postId: string, communityId: string = 'dontmatter') {
    const res = await patch(CENTER_ENDPOINTS.POST_SAVE(communityId, postId), {
      BASE_URLS: 'center',
    });
    return res;
  }

  static async fetchComment(
    postId: string,
    commentId: string | null = null,
    queries?: Partial<ThreadQueryParams>
  ) {
    const allQueries = {
      ...queries,
      postId,
      ...(commentId && { commentId }),
      children: 5,
      limit: 20,
    };
    const res = await get<ICommentData[], CommentPaginatedResponse<ICommentData>>('/', {
      BASE_URLS: 'comments',
      queries: [allQueries],
    });
    return res;
  }

  static async deleteComment(commentId: string) {
    const res = await deleteResource(CENTER_ENDPOINTS.POST_COMMENT(commentId), {
      BASE_URLS: 'comments',
    });
    return res;
  }

  static async editComment(commentId: string, content: string) {
    const res = await patch(CENTER_ENDPOINTS.POST_COMMENT(commentId), {
      BASE_URLS: 'comments',
      data: { content },
    });
    return res;
  }

  static async toggleCommentVote(commentId: string, voteType: 1 | -1) {
    const vote = voteType === 1 ? VoteEnum.upVote : VoteEnum.downVote;
    const res = await post(CENTER_ENDPOINTS.COMMENT_VOTE(commentId, vote), {
      BASE_URLS: 'comments',
    });
    return res;
  }

  // Debounced version
  static voteToggle = debounceAsync(this._voteToggle.bind(this), 400);
}

export default PostOp;
