import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, Typography, Skeleton, Row, Col, Divider } from 'antd';
import { FaPlus } from 'react-icons/fa6';
import CommunityOp from '@src/api/communityOperations';
import { getExactRoutePath, getRoutePath } from '@src/utils/getRoutePath';
import {
  PostSortOption,
  TimeRangeOption,
  POST_SORT_OPTIONS,
  TIME_RANGE_OPTIONS,
} from '@src/types/contants';
import CommunityFeed from '@src/components/Community/CommunityFeed';
import Communitysidebar from '@src/components/Community/Community.sidebar';
import { useAppDispatch, useAppSelector } from '@src/redux/hook';
import { fetchCommunity, updateCommunity } from '@src/redux/reducers/cache/community.slice';

const { Title } = Typography;

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
  const dispatch = useAppDispatch();
  const communityCache = useAppSelector((state) => state.communityCache.cache);
  const loading = useAppSelector((state) => state.communityCache.loading);
  const community = communityCache ?? null;

  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    handleNavigation();
  }, [slug, urlSort, urlRange]);

  useEffect(() => {
    if (!slug || (community && community.slug === slug)) return;
    dispatch(fetchCommunity(slug));
  }, [slug]);

  const handleNavigation = () => {
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
      const path = `${getExactRoutePath('COMMUNITY').replace(':slug', slug)}/${resolvedSort}${
        isTimeBased(resolvedSort) ? `/${resolvedRange}` : ''
      }`;
      navigate(path, { replace: true });
      return;
    }
  };

  if (!community?._id || loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  const handleFollowToggle = async () => {
    setJoinLoading(true);
    await CommunityOp._followToggle(community._id);
    dispatch(updateCommunity({ isFollowing: !community.isFollowing }));
    setTimeout(() => {
      setJoinLoading(false);
    }, 1000);
  };

  return (
    <div className="flex mt-1 flex-col w-full max-h-screen">
      {/* Banner */}
      <div className="w-full h-[160px] bg-transparent relative rounded-3xl">
        {community.bannerUrl && (
          <img
            src={community.bannerUrl}
            alt="Banner"
            className="bg-repeat-x w-full h-full rounded-2xl"
          />
        )}
      </div>

      {/* Header */}
      <div className="community_header relative flex items-end justify-start max-h-[56px] !w-full px-4">
        <Avatar
          size={100}
          src={community.avatarUrl}
          className="border-4 border-[var(--white)] absolute -top-0 left-0 !h-24 !w-24"
        />
        <div className="flex justify-between ml-3 flex-1">
          <Title level={1} className="!m-0 font-extrabold">
            r/{community.name}
          </Title>
          <div className="flex gap-4 ml-auto items-center">
            <Button
              className="!bg-transparent mr-2"
              type="dashed"
              disabled={joinLoading || !community.isFollowing}
              icon={<FaPlus />}
              onClick={() => navigate(getRoutePath('CREATE_POST').replace(':slug', slug!))}
            >
              Create Post
            </Button>
            <Button
              className="border border-gray-50"
              disabled={joinLoading}
              type={community.isFollowing ? 'default' : 'primary'}
              onClick={handleFollowToggle}
            >
              {community.isFollowing ? 'Joined' : 'Join'}
            </Button>
          </div>
        </div>
      </div>
      <Divider />

      {/* Main Layout */}
      <Row className="w-full max-w-7xl mx-auto mt-6 px-4 " gutter={[18, 18]}>
        <Col span={24} md={17} className="">
          {/* Post Feed */}
          <CommunityFeed community={community} />
        </Col>

        <Col span={0} md={7}>
          {/* Sidebar */}
          <Communitysidebar community={community} />
        </Col>
      </Row>
    </div>
  );
}
