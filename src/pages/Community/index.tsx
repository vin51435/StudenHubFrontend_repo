import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, Typography, Skeleton, Row, Col, Divider, Upload } from 'antd';
import { FiEdit2 } from 'react-icons/fi';
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
  const user = useAppSelector((state) => state.auth.user)!;
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
    }, 3000);
  };

  const changeAvatar = (info: any) => {
    const file = info.file; // This is the actual File object
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    CommunityOp.updateAvatar(formData, community._id).then(() => {
      dispatch(fetchCommunity(community.slug));
    });
  };

  const changeBanner = async (info: any) => {
    const file = info.file; // This is the actual File object
    if (!file) return;

    const formData = new FormData();
    formData.append('banner', file);

    CommunityOp.updateBanner(formData, community._id).then(() => {
      dispatch(fetchCommunity(community.slug));
    });
  };

  return (
    <div className="max-h-screen- mt-1 flex w-full flex-col items-center">
      {/* Banner */}
      <div className="relative h-[160px] w-full rounded-3xl bg-transparent">
        {community.bannerUrl && (
          <img
            src={community.bannerUrl}
            alt="Banner"
            className="object-covr h-full w-full rounded-2xl bg-repeat-x"
          />
        )}
        {community.owner === user._id && (
          <label className="absolute top-2 right-2 cursor-pointer rounded-full p-1">
            <Upload customRequest={changeBanner} maxCount={1} showUploadList={false}>
              <FiEdit2 className="" size={20} />
            </Upload>
          </label>
        )}
      </div>

      {/* Header */}
      <div className="community_header relative flex max-h-[56px] !w-full items-end justify-start px-4">
        <div className="relative w-fit">
          <Avatar
            size={100}
            src={community.avatarUrl}
            alt="Avatar"
            className="absolute -top-0 left-0 !h-24 !w-24 border-4 border-[var(--white)]"
          />
          {community.owner === user._id && (
            <label className="absolute top-2 right-2 cursor-pointer rounded-full p-1">
              <Upload customRequest={changeAvatar} maxCount={1} showUploadList={false}>
                <FiEdit2 className="" size={20} />
              </Upload>
            </label>
          )}
        </div>

        <div className="ml-3 flex flex-1 justify-between">
          <Title level={1} className="!m-0 font-extrabold">
            r/{community.name}
          </Title>
          <div className="ml-auto flex items-center gap-4">
            <Button
              className="mr-2 !bg-transparent"
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
      <Row className="w-full max-w-7xl px-0 pb-4" gutter={[18, 18]}>
        <Col span={24} md={17} className="!pl-0">
          {/* Post Feed */}
          <CommunityFeed community={community} />
        </Col>

        <Col span={0} md={7} className="!pr-0">
          {/* Sidebar */}
          <Communitysidebar community={community} />
        </Col>
      </Row>
    </div>
  );
}
