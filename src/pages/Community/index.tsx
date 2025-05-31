import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, Card, Typography, Skeleton, Row, Col } from 'antd';
import { PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { ICommunity } from '@src/types/app';
import CommunityOp from '@src/api/communityOperations';
import PostSortDropdown from '@src/components/PostSorting';
import { getRoutePath } from '@src/utils/getRoutePath';
import UserOp from '@src/api/userOperations';

const { Title, Paragraph, Text } = Typography;

export default function CommunityOverview() {
  const { slug } = useParams<{ slug: string }>();
  const [community, setCommunity] = useState<ICommunity | null>(null);
  const [posts, setPosts] = useState<[]>([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();

  if (!slug) navigate(getRoutePath('HOME'));

  useEffect(() => {
    if (!slug || CommunityOp.view.communityDetails) return;

    setLoading(true);
    CommunityOp.fetchCommunityDetails(slug).then((res) => {
      setCommunity(res.data ?? null);
      setLoading(false);
    });
  }, [slug]);

  if (!community || loading) {
    console.log('loading');
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Banner */}
      <div className="w-full h-[160px] bg-gray-200 relative">
        {community.bannerUrl && (
          <img src={community.bannerUrl} alt="Banner" className="bg-repeat-x  w-full h-full" />
        )}
      </div>

      <div className="relative flex items-end justify-start h-fit max-h-[56px] px-4">
        {/* Avatar */}
        <Avatar
          size={100}
          style={{ width: '100px', height: '100px' }}
          src={community.avatarUrl}
          className="border-4 border-white absolute -top-0 left-0"
        />
        <div className="w-full flex justify-between ml-3">
          <Title level={3} className="!m-0">
            {community.name}
          </Title>
          <div>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => navigate(getRoutePath('CREATE_POST').replace(':slug', slug!))}
            >
              Create Post
            </Button>
            <Button
              type={joined ? 'default' : 'primary'}
              onClick={() => CommunityOp.followToggle(community._id)}
            >
              {joined ? 'Joined' : 'Join'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <Row className="flex flex-col lg:flex-row gap-6 mt-6 max-w-7xl mx-auto w-full relative">
        {/* Left (Posts) */}
        <Col span={16} className="flex-1 relative">
          {/* <PostSortDropdown /> */}
          {/* {posts.length ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <Text type="secondary">No posts yet.</Text>
            )} */}
          <Text type="secondary">No posts yet.</Text>
        </Col>

        {/* Right Sidebar */}
        <Col span={7} className="w-full ">
          <Card variant="outlined" className="shadow-md text-start">
            <Title level={5}>About {community.name}</Title>
            <Paragraph className="text-sm">{community.description}</Paragraph>
            <div className="flex justify-between items-center mt-4">
              <div>
                <Text strong>{community.followersCount || 0}</Text>
                <Text type="secondary" className="block text-xs">
                  Members
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
