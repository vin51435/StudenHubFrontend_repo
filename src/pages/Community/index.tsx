import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, Card, Typography, Skeleton, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ICommunity } from '@src/types/app';
import CommunityOp from '@src/api/communityOperations';
import { getRoutePath } from '@src/utils/getRoutePath';
import PostSortDropdown from '@src/components/PostSorting';
import {
  PostSortOption,
  TimeRangeOption,
  POST_SORT_OPTIONS,
  TIME_RANGE_OPTIONS,
} from '@src/types/contants';

const { Title, Paragraph, Text } = Typography;

export default function CommunityOverview() {
  const navigate = useNavigate();
  const {
    slug,
    sort: urlSort,
    range: urlRange,
  } = useParams<{
    slug: string;
    sort?: PostSortOption;
    range?: TimeRangeOption;
  }>();

  const [community, setCommunity] = useState<ICommunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [sort, setSort] = useState<PostSortOption>('Hot');
  const [range, setRange] = useState<TimeRangeOption>('today');

  useEffect(() => {
    if (!slug) {
      navigate(getRoutePath('HOME'));
      return;
    }

    const isValidSort = urlSort && POST_SORT_OPTIONS.includes(urlSort);
    const isTimeBased = (s: string) => ['Top', 'Controversial'].includes(s);
    const isValidRange = urlRange && TIME_RANGE_OPTIONS.includes(urlRange);

    const resolvedSort: PostSortOption = isValidSort ? urlSort! : 'Hot';
    const resolvedRange: TimeRangeOption = isValidRange ? urlRange! : 'today';

    const needsRedirect =
      !isValidSort ||
      (isTimeBased(resolvedSort) && !isValidRange) ||
      (!isTimeBased(resolvedSort) && urlRange);

    if (needsRedirect) {
      const path = `/community/${slug}/${resolvedSort}${
        isTimeBased(resolvedSort) ? `/${resolvedRange}` : ''
      }`;
      navigate(path, { replace: true });
      return;
    }

    setSort(resolvedSort);
    setRange(resolvedRange);
  }, [slug, urlSort, urlRange, navigate]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    CommunityOp.fetchCommunityDetails(slug).then((res) => {
      setCommunity(res.data ?? null);
      setLoading(false);
    });
  }, [slug]);

  const handleSortChange = (newSort: PostSortOption, newRange?: TimeRangeOption) => {
    setSort(newSort);
    const isTimeBased = ['Top', 'Controversial'].includes(newSort);
    if (isTimeBased) {
      const validRange = newRange ?? 'today';
      setRange(validRange);
      navigate(`/community/${slug}/${newSort}/${validRange}`);
    } else {
      setRange('today'); // fallback
      navigate(`/community/${slug}/${newSort}`);
    }
  };

  if (!community || loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Banner */}
      <div className="w-full h-[160px] bg-gray-200 relative">
        {community.bannerUrl && (
          <img src={community.bannerUrl} alt="Banner" className="bg-repeat-x w-full h-full" />
        )}
      </div>

      {/* Header */}
      <div className="relative flex items-end justify-start max-h-[56px] px-4">
        <Avatar
          size={100}
          src={community.avatarUrl}
          className="border-4 border-white absolute -top-0 left-0"
        />
        <div className="w-full flex justify-between ml-3">
          <Title level={3} className="!m-0">
            {community.name}
          </Title>
          <div className="flex gap-2">
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => navigate(getRoutePath('CREATE_POST').replace(':slug', slug!))}
            >
              Create Post
            </Button>
            <Button
              type={joined ? 'default' : 'primary'}
              onClick={() => {
                CommunityOp.followToggle(community._id);
                setJoined((prev) => !prev);
              }}
            >
              {joined ? 'Joined' : 'Join'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <Row className="flex flex-col lg:flex-row gap-6 mt-6 max-w-7xl mx-auto w-full relative">
        {/* Posts Area */}
        <Col span={16} className="flex-1 relative">
          <PostSortDropdown value={{ sort, timeRange: range }} onChange={handleSortChange} />
          {/* You can plug in posts logic here */}
          <Text type="secondary">No posts yet.</Text>
        </Col>

        {/* Sidebar */}
        <Col span={7} className="w-full">
          <Card className="shadow-md text-start">
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
