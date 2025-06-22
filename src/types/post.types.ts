import { IUser } from '@src/types/app';
import { VoteEnum } from '@src/types/enum';

export interface IPostCommentDTO {
  parentId?: null | string;
  content: string;
}

export interface ThreadQueryParams {
  postId: string;
  commentId: string;
  limit?: string; // default: '5'
  skip?: string; // default: '0'
  page?: string;
  children?: string; // default: '1'
  childLimit?: string; // default: '5'
  childSkip?: string; // default: '0'
  sortMethod?: CommentSortMethod; // default: SortMethod.Date
  sortOrder?: SortOrder; // default: SortOrder.Descending
}

export type SortOrder = 'ascending' | 'descending'; // assuming these are the possible values

export interface ICommentData {
  _id: string;
  postId: string;
  userId: IUser;
  content: string | null;
  childrenCount: number;
  upvotesCount: number;
  downvotesCount: number;
  commentsCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  children?: ICommentData[];
  parentId?: string;
  voteType: VoteEnum | null;

  isCollapsed?: boolean;
}

export enum CommentSortMethod {
  Date = 'date',
  Votes = 'votes',
}
