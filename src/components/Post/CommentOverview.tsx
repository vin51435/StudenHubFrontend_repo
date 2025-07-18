import React from 'react';
import { Card } from 'antd';
import { BiSolidUpvote, BiUpvote, BiDownvote, BiSolidDownvote } from 'react-icons/bi';
import { timeAgo } from '@src/utils/common';
import { VoteEnum } from '@src/types/enum';
import { Link } from 'react-router-dom';
import { getRoutePath } from '@src/utils/getRoutePath';

export type CommentOverviewItemProps = {
  comment: {
    _id: string;
    content: string;
    createdAt: string;
    upvotesCount: number;
    downvotesCount: number;
    userId: {
      username: string;
    };
    postId: {
      title: string;
      slug: string;
      communityId?: {
        avatarUrl?: string;
        slug?: string;
      } | null;
    };
    voteType: VoteEnum | null;
  };
};

const CommentOverviewItem: React.FC<CommentOverviewItemProps> = ({ comment }) => {
  const { userId, postId, content, createdAt, upvotesCount, downvotesCount } = comment;

  return (
    <Link
      to={getRoutePath('POST')
        .replace(':slug', postId.communityId?.slug ?? '')
        .replace(':postSlug', postId.slug)}
      className="block w-full cursor-pointer"
    >
      <Card
        className="mb-4 rounded-2xl !bg-transparent shadow-md transition-all duration-200 hover:shadow-lg"
        classNames={{ body: '!p-4 ' }}
      >
        <div className="mb-0.5 flex items-center gap-2 text-sm">
          {postId.communityId?.avatarUrl && (
            <>
              <img
                src={postId.communityId.avatarUrl}
                alt="community avatar"
                className="h-6 w-6 rounded-full"
              />
              {postId.communityId?.slug && (
                <span className="font-medium">@{postId.communityId.slug}</span>
              )}
            </>
          )}
          <span className="text-xs">·</span>
          <span className="">
            Post: <strong>{postId.title}</strong>
          </span>
        </div>

        <div className="mb-2 text-start text-sm">
          <span className="font-semibold">{userId.username}</span> commented {timeAgo(createdAt)}
        </div>

        <div
          className="prose mb-2 max-w-none text-start text-lg"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div className="flex hidden gap-4 text-sm">
          <div className="flex items-center gap-1">
            <BiSolidUpvote
              className="flex cursor-pointer items-center text-orange-700"
              size={18}
            />{' '}
          </div>
          <div className="flex items-center gap-1">
            <BiSolidDownvote
              className="flex cursor-pointer items-center text-blue-400"
              size={18}
            />{' '}
          </div>
          <>
            {comment.voteType === VoteEnum.upVote ? (
              <BiSolidUpvote
                className="flex cursor-pointer items-center text-orange-700"
                size={18}
              />
            ) : (
              <BiUpvote className="flex cursor-pointer items-center" size={18} />
            )}
            <span className="pl-1 text-xs">{comment.upvotesCount - comment.downvotesCount}</span>
            {comment.voteType === VoteEnum.downVote ? (
              <BiSolidDownvote
                className="flex cursor-pointer items-center text-blue-400"
                size={18}
              />
            ) : (
              <BiDownvote className="flex cursor-pointer items-center" size={18} />
            )}
          </>
        </div>
      </Card>
    </Link>
  );
};

export default CommentOverviewItem;
