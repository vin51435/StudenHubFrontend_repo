import RecentPostsSidebar from '@src/components/Post/RecentPostsSidebar';
import HomeFeed from '@src/pages/Home/components/content';
import { Row, Col } from 'antd';

const Home = () => {
  return (
    <Row className="mt-4 w-full max-w-7xl" gutter={[18, 18]}>
      <Col span={24} md={17} className="!pl-0">
        {/* Post Feed */}
        <HomeFeed />
      </Col>

      <Col span={0} md={7} className="!pr-0">
        {/* Sidebar */}
        <div className="hidden md:block">
          <RecentPostsSidebar />
        </div>
      </Col>
    </Row>
  );
};

export default Home;
