import PostOverview from '@src/components/Post/PostOverview';
import { useAppDispatch, useAppSelector } from '@src/redux/hook';
import { fetchHomeFeed } from '@src/redux/reducers/cache/home.thunks';
import Spin from 'antd/es/spin';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function HomeFeed() {
  const homeFeed = useAppSelector((state) => state.homeCache);
  const dispatch = useAppDispatch();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (homeFeed.posts.length) return;
    dispatch(fetchHomeFeed({ page: 1, sort: 'Top' }));
  }, []);

  return (
    <section className="">
      <div className="mb-4">
        {/* <PostSortDropdown value={{ sort: sort, timeRange: range }} onChange={handleSortChange} /> */}
      </div>
      {homeFeed.loading ? (
        <div className="h-full flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : homeFeed.posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {homeFeed.posts.map((post, index) => (
            <PostOverview
              key={index}
              post={post}
              // onChangePost={onPostUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <span>No posts to display</span>
        </div>
      )}
      {homeFeed.hasMore && (
        <div ref={ref} className="h-full flex justify-center items-center">
          Loading more...
        </div>
      )}
    </section>
  );
}
