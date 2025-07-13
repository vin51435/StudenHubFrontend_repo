import PostOverviewCompact from '@src/components/Post/PostOverviewCompact';
import { useAppDispatch, useAppSelector } from '@src/redux/hook';
import { clearRecentPosts } from '@src/redux/reducers/cache/recents.slice';
import { IPost } from '@src/types/app';
import { Button, Card, Divider } from 'antd';

const RecentPostsSidebar = () => {
  const recentPosts = useAppSelector((state) => state.recentStore);
  const dispatch = useAppDispatch();

  if (recentPosts.posts.length === 0) {
    return null;
  }

  return (
    <Card
      className="recent-posts_sidebar !border-[var(--secondary-white)] !bg-transparent"
      classNames={{
        body: 'text-start !p-4',
        title: 'text-start',
        extra: '',
        header: '!]borcer-b-0 !border-[var(--secondary-white)] !px-4',
      }}
      title={'Recent Posts'}
      extra={
        <Button
          type="link"
          className="!p-0 hover:!border-none focus-visible:!outline-none"
          onClick={() => dispatch(clearRecentPosts())}
        >
          Clear
        </Button>
      }
    >
      {recentPosts.posts.map((post) => {
        if (!post._id || !post.slug) return;
        return (
          <div key={post._id} className="mb-2">
            <PostOverviewCompact post={post as IPost} />
            <Divider />
          </div>
        );
      })}
    </Card>
  );
};

export default RecentPostsSidebar;
