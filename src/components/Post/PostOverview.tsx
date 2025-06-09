import { LuMessageSquareText } from 'react-icons/lu';
import { IoMdEye } from 'react-icons/io';
import { FaRegUser } from 'react-icons/fa';
import { FC } from 'react';
import { Card, Typography, Avatar, Carousel, Image } from 'antd';
import { ICommunity, IPost, IUser } from '@src/types/app';
import VoteIcon from '@src/components/Vote.svg';
import { VoteEnum } from '@src/types/enum';
import PostOp from '@src/api/postOperations';
import { getRoutePath } from '@src/utils/getRoutePath';
import { Link, useNavigate } from 'react-router-dom';
import { timeAgo } from '@src/utils/common';

const { Paragraph } = Typography;

const PostOverview: FC<{
  post: IPost;
  community?: ICommunity;
  onChangePost: (post: IPost) => void;
}> = ({ post, community, onChangePost }) => {
  const navigate = useNavigate();

  if (!post || !post._id) {
    return null;
  }

  const handleVote = async (type: 1 | -1) => {
    void PostOp.voteToggle(post._id!, type === 1 ? VoteEnum.upVote : VoteEnum.downVote);

    let vote: VoteEnum | null = post.voteType ?? null;
    let upVote = post.upvotesCount;
    let downVote = post.downvotesCount;
    let netVotes = post.netVotes ?? upVote - downVote;

    const isUp = type === 1;
    const isDown = type === -1;

    if (isUp && post.voteType === VoteEnum.upVote) {
      upVote -= 1;
      netVotes -= 1;
      vote = null;
    } else if (isDown && post.voteType === VoteEnum.downVote) {
      downVote -= 1;
      netVotes += 1;
      vote = null;
    } else {
      if (isUp) {
        upVote += 1;
        netVotes += 1;
        if (post.voteType === VoteEnum.downVote) {
          downVote -= 1;
          netVotes += 1;
        }
        vote = VoteEnum.upVote;
      } else {
        downVote += 1;
        netVotes -= 1;
        if (post.voteType === VoteEnum.upVote) {
          upVote -= 1;
          netVotes -= 1;
        }
        vote = VoteEnum.downVote;
      }
    }

    const updatedPost = {
      ...post,
      upvotesCount: upVote,
      downvotesCount: downVote,
      netVotes,
      voteType: vote,
    };

    onChangePost?.(updatedPost);
  };

  return (
    <Link
      to={getRoutePath('POST')
        .replace(':slug', (post.communityId as ICommunity)?.slug ?? community?.slug)
        .replace(':postSlug', post.slug)}
      className="block cursor-pointer w-full"
    >
      <Card
        classNames={{
          body: '!px-4 !py-3',
        }}
        className="post-overview rounded-2xl !bg-transparent w-full shadow-sm hover:shadow-md transition-all mb-4 h-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (community?._id) {
                  // Posts are inside community, user will be shown
                  // navigate(g)
                } else {
                  // Posts are not inside community, communioty name will be shown
                  navigate(
                    getRoutePath('COMMUNITY').replace(
                      ':slug',
                      (post.communityId as ICommunity)?.slug
                    )
                  );
                }
              }}
            >
              <Avatar
                size="small"
                src={
                  community?._id
                    ? (post?.authorId as IUser)?.profilePicture
                    : (post.communityId as ICommunity)?.avatarUrl
                }
                icon={<FaRegUser />}
              />
              <span className="text-xs ml-1">
                {community?._id ? (
                  <>
                    <span className="mr-1">u/{(post?.authorId as IUser)?.fullName}</span>
                  </>
                ) : (
                  <>
                    <span className="mr-1">r/{(post.communityId as ICommunity)?.slug}</span>
                  </>
                )}
              </span>
            </span>
            <span className="ml-2 text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        {/* Title */}
        <h2 className="post-overview_title text-start text-lg font-semibold ">{post.title}</h2>
        {/* Tags */}
        {/* <div className="my-2 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Tag key={tag} className="text-xs">
          {tag}
          </Tag>
          ))}
          </div> */}
        {/* Content Preview */}
        <Paragraph
          className="post-overview_content text-sm text-start text-gray-700 !mb-0"
          ellipsis={{ rows: 3, symbol: '...' }}
        >
          <div dangerouslySetInnerHTML={{ __html: post.content as string }} />
        </Paragraph>
        {/* Carousel for Media */}
        <div onClick={(e) => e.stopPropagation()}>
          <Carousel
            arrows
            infinite={false}
            className="w-full rounded-lg"
            dots={{ className: 'carousel-dots-dark' }}
          >
            {post.mediaUrls.map((url, index) => (
              <div
                key={index}
                className="relative w-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="w-full h-64 overflow-hidden">
                  <Image
                    src={url}
                    alt={`Media ${index + 1}`}
                    preview={false}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>
        {/* Post Stats */}
        <div className="flex items-center gap-5 text-sm text-gray-500 mt-2">
          <div
            className="flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <VoteIcon
                dir="up"
                onClick={() => handleVote(1)}
                className={`cursor-pointer  ${
                  post.voteType === VoteEnum.upVote && 'text-orange-700'
                }`}
              />
              {post.netVotes ?? post.upvotesCount - post.downvotesCount}
              <VoteIcon
                dir="down"
                onClick={() => handleVote(-1)}
                className={`cursor-pointer ml-2 ${
                  post.voteType === VoteEnum.downVote && 'text-purple-500'
                }`}
              />
            </span>
          </div>
          <div className="items-center gap-1  flex">
            <span className="inline-block text-center my-auto h-full ">
              <LuMessageSquareText />
            </span>
            <span className="inline-block text-center my-auto h-full ">{post.commentsCount}</span>
          </div>
          <div className=" ml-3 items-center gap-1 flex">
            <span className="inline-block text-center my-auto h-full ">
              <IoMdEye />
            </span>
            <span className="inline-block text-center my-auto h-full ">{post.views}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PostOverview;
