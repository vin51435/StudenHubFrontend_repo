import CommunityOp from '@src/api/communityOperations';
import { ICommunity } from '@src/types/app';
import { getRoutePath } from '@src/utils/getRoutePath';
import { Button, Card, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const Communitysidebar = ({
  community,
  allDetails = false,
  onCommunityChange,
}: {
  community: ICommunity;
  allDetails?: boolean;
  onCommunityChange?: (post: ICommunity) => void;
}) => {
  const [state, setState] = useState<{
    loading: boolean;
    joining: boolean;
  }>({
    loading: true,
    joining: false,
  });

  const navigate = useNavigate();

  return (
    <Card className="community-sidebar h-fit !shadow-md text-start sticky !bg-transparent">
      <Title className="flex justify-between items-center w-full" level={5}>
        <span onClick={() => navigate(getRoutePath('COMMUNITY').replace(':slug', community?.slug))}>
          r/{community?.name}
        </span>
        {allDetails && (
          <Button
            className="border border-gray-50"
            disabled={state.joining}
            type={community.isFollowing ? 'default' : 'primary'}
            onClick={async () => {
              setState((prev) => ({ ...prev, joining: true }));
              CommunityOp._followToggle(community?._id)
                .then(() => {
                  const updatedPost = {
                    ...community,
                    isFollowing: !community.isFollowing,
                  };
                  onCommunityChange && onCommunityChange(updatedPost);
                })
                .finally(() => setState((prev) => ({ ...prev, joining: false })));
            }}
          >
            {community?.isFollowing ? 'Joined' : 'Join'}
          </Button>
        )}
      </Title>
      <Paragraph className="text-sm">{community?.description}</Paragraph>
      <div className="flex justify-between items-center mt-4">
        <div>
          <Text type="secondary" className="dark:!text-gray-400 block text-xs">
            <Text className="mr-1" strong>
              {community?.followersCount || 0}
            </Text>
            Members
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default Communitysidebar;
