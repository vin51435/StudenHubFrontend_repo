import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import PostOverview from '../Post/PostOverview';
import { PostSortOption, TimeRangeOption } from '@src/types/contants';
import { useNavigate, useParams } from 'react-router-dom';
import PostSortDropdown from '@src/components/Post/PostSorting';
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
  const { hasMore, page, posts, loading, communityId } = useAppSelector((state) => state.postCache);

  useEffect(() => {
    // if (communityId === community._id) return;
    dispatch(fetchInitialPosts({ communityId: community._id, sort, range }));
    fresh.current = false;
  }, [slug, sort, range]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !fresh.current) {
      dispatch(fetchMorePosts({ sort, range }));
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
    <section>
      <div className="mb-2">
        <PostSortDropdown value={{ sort: sort, timeRange: range }} onChange={handleSortChange} />
      </div>
      {loading || !(communityId === community._id) ? (
        <div className="flex h-full items-center justify-center">
          <Spin size="large" />
        </div>
      ) : posts.length > 0 ? (
        <>
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
          {hasMore && (
            <div ref={ref} className="flex h-full items-center justify-center">
              Loading more...
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <span>No posts to display</span>
        </div>
      )}
    </section>
  );
};

export default CommunityFeed;
