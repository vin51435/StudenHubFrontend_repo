import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, Card, Typography, Skeleton, Row, Col, Divider } from 'antd';
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

    const resolvedSort: PostSortOption = isValidSort ? urlSort! : 'Top';
    const resolvedRange: TimeRangeOption = isValidRange ? urlRange! : 'all';

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
    <div className="flex mt-1 flex-col w-full min-h-screen">
      {/* Banner */}
      <div className="w-full h-[160px] bg-gray-200 relative rounded-3xl">
        {state?.data?.bannerUrl && (
          <img
            src={state?.data?.bannerUrl}
            alt="Banner"
            className="bg-repeat-x w-full h-full rounded-2xl"
          />
        )}
      </div>

      {/* Header */}
      <div className="community_header relative flex items-end justify-start max-h-[56px] px-4">
        <Avatar
          size={100}
          src={state?.data?.avatarUrl}
          className="border-4 border-white absolute -top-0 left-0"
        />
        <div className="w-full flex justify-between ml-3">
          <Title level={1} className="!m-0 font-extrabold">
            r/{state?.data?.name}
          </Title>
          <div className="flex gap-4 my-auto">
            <Button
              className="!bg-transparent mr-2"
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => navigate(getRoutePath('CREATE_POST').replace(':slug', slug!))}
            >
              Create Post
            </Button>
            <Button
              className="border border-gray-50"
              disabled={state.joining}
              type={state?.data?.isFollowing ? 'default' : 'primary'}
              onClick={async () => {
                setState((prev) => ({ ...prev, joining: true }));
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
      <Divider />

      {/* Main Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto mt-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Post Feed */}
          <CommunityFeed communityId={state?.data?._id} />

          {/* Sidebar */}
          <div>
            <Card className="shadow-md text-start sticky top-[90px]">
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
          </div>
        </div>
      </div>
    </div>
  );
}
