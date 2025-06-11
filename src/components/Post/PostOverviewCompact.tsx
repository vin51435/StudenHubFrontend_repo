import { ICommunity, IPost } from '@src/types/app';
import { timeAgo } from '@src/utils/common';
import { getRoutePath } from '@src/utils/getRoutePath';
import { Avatar, Image } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import DefaultAvatar from '/profile-default.svg';

const PostOverviewCompact = ({ post }: { post: IPost }) => {
  const community = post.communityId as ICommunity;
  const navigate = useNavigate();

  return (
    <Link
      to={getRoutePath('POST').replace(':postSlug', post.slug)}
      style={{ textDecoration: 'none', color: 'inherit' }}
      className="post-overview-compact_container w-full  dflex flex-col gap-2 rounded-xl transition"
    >
      <div className="grid grid-cols-3  w-full items-start">
        <div className={`${'col-span-2'}`}>
          {/* Top Row: Avatar + Community + Time */}
          <div
            className="flex items-center text-sm w-full overflow-hidden"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(getRoutePath('COMMUNITY').replace(':slug', community?.slug!));
            }}
          >
            {/* Avatar */}
            <Avatar
              size="small"
              src={community?.avatarUrl ?? DefaultAvatar}
              className="mr-1 shrink-0"
            />

            {/* Slug */}
            <span className="font-medium mx-1 max-w-[50%] truncate ">r/{community?.slug}</span>

            {/* Separator dot (optional) */}
            {/* <span className=" mx-1 shrink-0">•</span> */}

            {/* Time ago */}
            <span className="truncate max-w-[50%] ">{timeAgo(post.createdAt)}</span>
          </div>

          {/* Title + Optional Image */}

          <h2 className="text-sm font-semibold line-clamp-2 ">{post.title}</h2>
        </div>
        {/* Post title */}

        {/* Thumbnail if exists */}
        {post.mediaUrls?.[0] && (
          <div className="col-span-1 justify-self-end">
            <Image
              src={post.mediaUrls[0]}
              width={60}
              height={60}
              preview={false}
              className="rounded-md object-cover"
              alt="thumbnail"
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default PostOverviewCompact;
