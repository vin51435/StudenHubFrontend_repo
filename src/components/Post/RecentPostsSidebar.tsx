import PostOverviewCompact from '@src/components/Post/PostOverviewCompact';
import { useAppDispatch, useAppSelector } from '@src/redux/hook';
import { clearRecentPosts } from '@src/redux/reducers/cache/recents.slice';
import { IPost } from '@src/types/app';
import { Button, Card, Divider } from 'antd';

const RecentPostsSidebar = () => {
  const recentPosts = useAppSelector((state) => state.recentStore);
  const dispatch = useAppDispatch();

  return (
    <Card
      className="recent-posts_sidebar !bg-transparent !border-[var(--secondary-white)]"
      classNames={{
        body: 'text-start',
        title: 'text-start',
        extra: '',
        header: '!]borcer-b-0 !border-[var(--secondary-white)]',
      }}
      title={'Recent Posts'}
      extra={
        <Button
          type="link"
          className="hover:!border-none focus-visible:!outline-none !p-0"
          onClick={() => dispatch(clearRecentPosts())}
        >
          Clear
        </Button>
      }
    >
      {recentPosts.posts.map((post) => {
        if (!post._id) return;
        return (
          <>
            <div key={post._id} className="">
              <PostOverviewCompact post={post as IPost} />
            </div>
            <Divider />
          </>
        );
      })}
    </Card>
  );
};

export default RecentPostsSidebar;
