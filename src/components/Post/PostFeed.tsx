import { useEffect, useState, useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useInView } from 'react-intersection-observer';
import PostOverview from './PostOverview';
import axios from 'axios';
import { PostSortOption, TimeRangeOption } from '@src/types/contants';
import { useNavigate, useParams } from 'react-router-dom';
import PostSortDropdown from '@src/components/PostSorting';
import CommunityOp from '@src/api/communityOperations';
import { IPost } from '@src/types/app';
import { Spin } from 'antd';

type Post = Parameters<typeof PostOverview>[0]['post'];

const PAGE_SIZE = 10;

const CommunityFeed = ({ communityId }: { communityId: string }) => {
  const {
    slug,
    sort: urlSort,
    range: urlRange,
  } = useParams<{
    slug: string;
    sort?: PostSortOption;
    range?: TimeRangeOption;
  }>();
  const [state, setState] = useState<{
    posts: IPost[];
    page: string;
    hasMore: boolean;
    sort: PostSortOption;
    range: TimeRangeOption;
    loading: boolean;
  }>({
    posts: [],
    page: '1',
    hasMore: true,
    sort: urlSort ?? 'Top',
    range: urlRange ?? 'today',
    loading: true,
  });
  const { ref, inView } = useInView();
  const navigate = useNavigate();
  const fresh = useRef(true);

  const loadMorePosts = useCallback(
    async (page?: number) => {
      if (!state.hasMore && !fresh.current) return;
      setState((prev) => ({ ...prev, loading: true }));
      console.log('sort & range', state.sort, state.range);

      const res = await CommunityOp.getAllPosts(communityId, state.page, state.sort, state.range);
      const newPosts: IPost[] = res.data;
      setState((prev) => ({
        ...prev,
        page: page?.toString() ?? '1',
        posts: newPosts,
        hasMore: res.hasMore,
        loading: false,
      }));
    },
    [state.page, state.hasMore]
  );

  useEffect(() => {
    console.log('this ran');
    loadMorePosts();
    fresh.current = false;
  }, [urlSort, urlRange]);

  useEffect(() => {
    if (inView && state.hasMore) loadMorePosts(Number(state.page) + 1);
  }, [inView]);

  const handleSortChange = (newSort: PostSortOption, newRange?: TimeRangeOption) => {
    let sort = newSort;
    let range = 'today';
    const isTimeBased = ['Top', 'Controversial'].includes(newSort);
    if (isTimeBased) {
      const validRange = newRange ?? 'today';
      range = validRange;
      navigate(`/community/${slug}/${newSort}/${validRange}`);
    } else {
      range = 'today';
      navigate(`/community/${slug}/${newSort}`);
    }
    fresh.current = true;
    console.log('sort & range', sort, range);
    setState((prev) => ({
      ...prev,
      sort,
      range,
    }));
  };

  return (
    <div>
      <PostSortDropdown
        value={{ sort: state.sort, timeRange: state.range }}
        onChange={handleSortChange}
      />
      {state.loading ? (
        <div className="h-[400px] flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <List height={800} itemCount={state.posts.length} itemSize={250} width="100%">
          {({ index, style }) => (
            <div style={style}>
              <PostOverview post={state.posts[index]} />
            </div>
          )}
        </List>
      )}
      {state.hasMore && (
        <div ref={ref} className="h-10 flex justify-center items-center">
          Loading more...
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
