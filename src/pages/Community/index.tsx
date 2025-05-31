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
import CommunityFeed from '@src/components/Post/PostFeed';

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

  const [state, setState] = useState<{
    data: ICommunity | null;
    loading: boolean;
    joining: boolean;
  }>({
    data: null,
    loading: true,
    joining: false,
  });

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
  }, [slug, urlSort, urlRange, navigate]);

  useEffect(() => {
    if (!slug) return;
    setState({
      data: null,
      loading: true,
      joining: false,
    });
    (async () => {
      const res = await CommunityOp.fetchCommunityDetails(slug);
      setState({
        data: res?.data ?? null,
        loading: false,
        joining: false,
      });
    })();
  }, [slug]);

  if (!state?.data?._id || state.loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Banner */}
      <div className="w-full h-[160px] bg-gray-200 relative">
        {state?.data?.bannerUrl && (
          <img src={state?.data?.bannerUrl} alt="Banner" className="bg-repeat-x w-full h-full" />
        )}
      </div>

      {/* Header */}
      <div className="relative flex items-end justify-start max-h-[56px] px-4">
        <Avatar
          size={100}
          src={state?.data?.avatarUrl}
          className="border-4 border-white absolute -top-0 left-0"
        />
        <div className="w-full flex justify-between ml-3">
          <Title level={3} className="!m-0">
            {state?.data?.name}
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
              disabled={state.joining}
              type={state?.data?.isFollowing ? 'default' : 'primary'}
              onClick={async () => {
                setState((prev) => ({
                  ...prev,
                  joining: true,
                }));

                await CommunityOp._followToggle(state?.data?._id);

                setState((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    isFollowing: !prev.data?.isFollowing,
                  } as ICommunity,
                  joining: false,
                }));
              }}
            >
              {state?.data?.isFollowing ? 'Joined' : 'Join'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <Row className=" mt-6 max-w-7xl mx-auto w-full relative">
        {/* Posts Area */}
        <Col span={17} className="flex-1 relative">
          {/* You can plug in posts logic here */}
          {state.loading && !state?.data?._id ? (
            <Text type="secondary">No posts yet.</Text>
          ) : (
            <CommunityFeed communityId={state?.data?._id} />
            // <div>ded</div>
          )}
        </Col>

        {/* Sidebar */}
        <Col span={7} className="w-full">
          <Card className="shadow-md text-start">
            <Title level={5}>About {state?.data?.name}</Title>
            <Paragraph className="text-sm">{state?.data?.description}</Paragraph>
            <div className="flex justify-between items-center mt-4">
              <div>
                <Text strong>{state?.data?.followersCount || 0}</Text>
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
