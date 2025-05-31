import { Card } from 'antd';
import { MessageOutlined, LikeOutlined, EyeOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { IPost } from '@src/types/app';

const PostOverview: FC<{ post: IPost }> = ({ post }) => (
  <Card
    className="rounded-2xl shadow-sm hover:shadow-md transition-all mb-4"
    title={
      <a href={`/post/${post.slug}`} className="text-lg font-semibold">
        {post.title}
      </a>
    }
  >
    <div className="text-sm text-gray-500 mb-2">{post.tags.join(', ')}</div>
    {post.mediaUrls.length > 0 && (
      <img src={post.mediaUrls[0]} alt="" className="w-full h-48 object-cover rounded-md mb-2" />
    )}
    <p className="text-gray-700">{post.content?.slice(0, 150)}...</p>
    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
      <span>
        <LikeOutlined /> {post.upvotesCount - post.downvotesCount}
      </span>
      <span>
        <MessageOutlined /> {post.commentsCount}
      </span>
      <span>
        <EyeOutlined /> {post.views}
      </span>
    </div>
  </Card>
);

export default PostOverview;
