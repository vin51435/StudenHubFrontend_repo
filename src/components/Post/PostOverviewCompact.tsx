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
      className="post-overview-compact_container dflex w-full flex-col gap-2 rounded-xl transition"
    >
      <div
        className="grid w-full items-start overflow-hidden"
        style={{ gridTemplateColumns: post.mediaUrls?.[0] ? 'minmax(0, 1fr) 60px' : '1fr' }}
      >
        {/* Left Content */}
        <div className="min-w-0 pr-2">
          {/* Top Row: Avatar + Community + Time */}
          <div
            className="mb-0.5 flex w-full items-center justify-between overflow-hidden text-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(getRoutePath('COMMUNITY').replace(':slug', community?.slug!));
            }}
          >
            <div className="flex min-w-0 items-center">
              <Avatar
                size={20}
                src={community?.avatarUrl ?? DefaultAvatar}
                className="mr-1 shrink-0"
              />
              <span className="mx-1 truncate font-medium">r/{community?.slug}</span>
            </div>
            <span className="max-w-[50%] truncate text-end">{timeAgo(post.createdAt)}</span>
          </div>

          <h2 className="line-clamp-2 text-sm font-semibold">{post.title}</h2>
        </div>

        {/* Thumbnail (fixed size) */}
        {post.mediaUrls?.[0] && (
          <div className="h-[60px] w-[60px] shrink-0 justify-self-end overflow-hidden rounded-md">
            <Image
              src={post.mediaUrls[0]}
              width={60}
              height={60}
              preview={false}
              className="h-full w-full rounded-md object-cover"
              alt="thumbnail"
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default PostOverviewCompact;
