import { useEffect, useState, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import PostOverview from './PostOverview';
import { PostSortOption, TimeRangeOption } from '@src/types/contants';
import { useNavigate, useParams } from 'react-router-dom';
import PostSortDropdown from '@src/components/Post/PostSorting';
import CommunityOp from '@src/api/communityOperations';
import { ICommunity, IPost } from '@src/types/app';
import { Spin } from 'antd';

type Post = Parameters<typeof PostOverview>[0]['post'];

const PAGE_SIZE = 10;

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

  const [state, setState] = useState<{
    posts: IPost[];
    page: string;
    hasMore: boolean;
  }>(() => ({
    posts: [],
    page: '1',
    hasMore: true,
  }));

  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView();
  const navigate = useNavigate();
  const fresh = useRef(true);

  const loadMorePosts = useCallback(
    async (page?: number) => {
      // if (!state.hasMore && !fresh.current) return;

      console.log('Fetching with sort & range:', sort, range);

      const res = await CommunityOp.getAllPosts(
        community._id,
        page?.toString() ?? state.page,
        sort,
        ['Top', 'Controversial'].includes(sort) ? range : undefined
      );

      const newPosts: IPost[] = res.data;
      setState((prev) => ({
        ...prev,
        page: page?.toString() ?? '1',
        posts: newPosts,
        hasMore: res.hasMore,
      }));
      setLoading(false);
      fresh.current = false;
    },
    [community._id, sort, range, state.page, state.hasMore]
  );

  // Reload when sort/range change
  useEffect(() => {
    setLoading(true);
    setState({ posts: [], page: '1', hasMore: true });
    fresh.current = true;
    loadMorePosts(1);
  }, [sort, range]);

  // Infinite scroll
  useEffect(() => {
    if (inView && state.hasMore && !fresh.current) {
      loadMorePosts(Number(state.page) + 1);
    }
  }, [inView]);

  const handleSortChange = (newSort: PostSortOption, newRange?: TimeRangeOption) => {
    const isTimeBased = ['Top', 'Controversial'].includes(newSort);
    if (isTimeBased) {
      navigate(`/community/${slug}/${newSort}/${newRange ?? 'today'}`);
    } else {
      navigate(`/community/${slug}/${newSort}`);
    }
  };

  const onPostUpdate = (post: IPost) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p._id === post._id ? post : p)),
    }));
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
      ) : state.posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {state.posts.map((post, index) => (
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
      {state.hasMore && (
        <div ref={ref} className="h-full flex justify-center items-center">
          Loading more...
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
