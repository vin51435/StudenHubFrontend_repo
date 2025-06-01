import { FC } from 'react';
import { Card, Tag, Typography, Avatar, Carousel, Badge, Image } from 'antd';
import Icon, {
  MessageOutlined,
  EyeOutlined,
  UserOutlined,
  DownCircleFilled,
  UpCircleFilled,
} from '@ant-design/icons';
import { IPost } from '@src/types/app';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import VoteIcon from '@src/components/Vote.svg';
import { VoteEnum } from '@src/types/enum';
import { useThemeMode } from '@src/theme/ThemeProvider';
import PostOp from '@src/api/postOperations';

const { Paragraph } = Typography;

const PostOverview: FC<{ post: IPost; onChangePost?: (post: IPost) => void }> = ({
  post,
  onChangePost,
}) => {
  if (!post || !post._id) {
    return null;
  }

  const handleVote = async (type: 1 | -1) => {
    void PostOp.voteToggle(post._id!, type === 1 ? VoteEnum.upVote : VoteEnum.downVote);
    let vote: VoteEnum | null = null;
    let upVote = post.upvotesCount;
    let downVote = post.downvotesCount;
    let netVotes = post.netVotes ?? 0;
    if (type === 1 && post.voteType !== VoteEnum.upVote) {
      vote = VoteEnum.upVote;
      upVote += 1;
      netVotes += 1;
    } else if (type === -1 && post.voteType !== VoteEnum.downVote) {
      vote = VoteEnum.downVote;
      downVote += 1;
      netVotes -= 1;
    } else if (type === 1 && post.voteType === VoteEnum.upVote) {
      vote = null;
      upVote -= 1;
      netVotes -= 1;
    } else if (type === -1 && post.voteType === VoteEnum.downVote) {
      vote = null;
      downVote -= 1;
      netVotes += 1;
    }

    const updatedPost = {
      ...post,
      upvotesCount: upVote,
      downvotesCount: downVote,
      netVotes: netVotes,
      voteType: vote,
    };

    if (onChangePost) {
      onChangePost(updatedPost);
    }
  };

  return (
    <Card
      classNames={{
        body: '!px-6 !py-3',
      }}
      className="post-overview rounded-2xl !bg-transparent w-full shadow-sm hover:shadow-md transition-all mb-4  max-w-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar size="small" icon={<UserOutlined />} />
          <span className="text-xs text-gray-500">{post?.author?.fullName}</span>
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
      <Carousel
        arrows
        infinite={false}
        className="w-full rounded-lg"
        dots={{ className: 'carousel-dots-dark' }} // Custom class for dots
      >
        {post.mediaUrls.map((url, index) => (
          <div key={index} className="relative w-full">
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

      {/* Post Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
        <span className="flex items-center gap-1">
          <span className="flex items-center gap-1 text-sm">
            <VoteIcon
              dir="up"
              onClick={() => handleVote(1)}
              className={`cursor-pointer text-gray-400 ${
                post.voteType === VoteEnum.upVote && 'text-orange-700'
              }`}
            />
            {post.netVotes ?? post.upvotesCount - post.downvotesCount}
            <VoteIcon
              dir="down"
              onClick={() => handleVote(-1)}
              className={`cursor-pointer ml-2 text-gray-400 ${
                post.voteType === VoteEnum.downVote && 'text-purple-500'
              }`}
            />
          </span>
        </span>
        <span className="flex items-center gap-1">
          <MessageOutlined /> {post.commentsCount}
        </span>
        <span className="flex items-center gap-1">
          <EyeOutlined /> {post.views}
        </span>
      </div>
    </Card>
  );
};

export default PostOverview;
