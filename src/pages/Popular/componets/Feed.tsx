import PostOverview from '@src/components/Post/PostOverview';
import { useAppSelector, useAppDispatch } from '@src/redux/hook';
import {
  fetchPopularFeedThunk,
  updatePopularPosts,
} from '@src/redux/reducers/cache/popularPosts.slice';
import { IPost } from '@src/types/app';
import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const PopularFeed = () => {
  const popularFeed = useAppSelector((state) => state.popularFeedCache);
  const dispatch = useAppDispatch();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (popularFeed.posts.length) return;
    dispatch(fetchPopularFeedThunk({ page: 1, sort: 'Top', fresh: true }));
  }, []);

  const updatePost = (post: IPost) => {
    dispatch(updatePopularPosts(post));
  };

  return (
    <section className="">
      <div className="mb-4">
        {/* <PostSortDropdown value={{ sort: sort, timeRange: range }} onChange={handleSortChange} /> */}
      </div>
      {popularFeed.loading ? (
        <div className="h-full flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : popularFeed.posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {popularFeed.posts.map((post, index) => (
            <PostOverview key={index} post={post} onChangePost={updatePost} />
          ))}
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <span>No posts to display</span>
        </div>
      )}
      {popularFeed.hasMore && (
        <div ref={ref} className="h-full flex justify-center items-center">
          Loading more...
        </div>
      )}
    </section>
  );
};

export default PopularFeed;
