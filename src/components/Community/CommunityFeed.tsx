import { useEffect, useState, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import PostOverview from '../Post/PostOverview';
import { PostSortOption, TimeRangeOption } from '@src/types/contants';
import { useNavigate, useParams } from 'react-router-dom';
import PostSortDropdown from '@src/components/Post/PostSorting';
import CommunityOp from '@src/api/communityOperations';
import { ICommunity, IPost } from '@src/types/app';
import { Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '@src/redux/hook';
import { fetchInitialPosts, fetchMorePosts } from '@src/redux/reducers/cache/post.thunks';
import { getExactRoutePath } from '@src/utils/getRoutePath';
import { updatePost } from '@src/redux/reducers/cache/post.slice';

const CommunityFeed = ({ community }: { community: ICommunity }) => {
  const {
    slug,
    sort = 'Top',
    range = 'all',
  } = useParams<{
    slug: string;
    sort?: PostSortOption;
    range?: TimeRangeOption;
  }>();
  const { ref, inView } = useInView();
  const navigate = useNavigate();
  const fresh = useRef(true);
  const dispatch = useAppDispatch();
  const { hasMore, page, posts, loading } = useAppSelector((state) => state.postCache);

  useEffect(() => {
    if (!slug || posts.length || !fresh.current) return;
    if (posts[0]?.communityId === community._id) return;
    dispatch(fetchInitialPosts({ communityId: community._id, sort, range }));
    fresh.current = false;
  }, [slug, sort, range]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !fresh.current) {
      dispatch(fetchMorePosts({ communityId: community._id, page: page + 1, sort, range }));
    }
  }, [inView]);

  const handleSortChange = (newSort: PostSortOption, newRange?: TimeRangeOption) => {
    const isTimeBased = ['Top', 'Controversial'].includes(newSort);
    if (isTimeBased) {
      navigate(
        `${getExactRoutePath('COMMUNITY').replace(':slug', slug!)}/${newSort}/${
          newRange ?? 'today'
        }`
      );
    } else {
      navigate(`${getExactRoutePath('COMMUNITY').replace(':slug', slug!)}/${newSort}`);
    }
  };

  const onPostUpdate = (post: IPost) => {
    dispatch(updatePost(post));
  };

  return (
    <div className="">
      <div className="mb-4">
        <PostSortDropdown value={{ sort: sort, timeRange: range }} onChange={handleSortChange} />
      </div>
      {loading ? (
        <div className="h-full flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((post, index) => (
            <PostOverview
              key={index}
              post={post}
              community={community}
              onChangePost={onPostUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <span>No posts to display</span>
        </div>
      )}
      {hasMore && (
        <div ref={ref} className="h-full flex justify-center items-center">
          Loading more...
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
