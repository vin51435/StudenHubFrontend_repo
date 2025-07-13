import CommunityOp from '@src/api/communityOperations';
import { ICommunity } from '@src/types/app';
import { getRoutePath } from '@src/utils/getRoutePath';
import { Button, Card, Typography, Input, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdModeEditOutline } from 'react-icons/md';
import { useAppSelector } from '@src/redux/hook';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Communitysidebar = ({
  community,
  allDetails = false,
  onCommunityChange,
}: {
  community: ICommunity;
  allDetails?: boolean;
  onCommunityChange?: (updated: ICommunity) => void;
}) => {
  const [state, setState] = useState({ loading: false, joining: false });
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(community?.description || '');
  const [saving, setSaving] = useState(false);
  const user = useAppSelector((state) => state.auth.user)!;

  const navigate = useNavigate();

  const handleSave = async () => {
    if (desc === community.description) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('description', desc);
      await CommunityOp.updateCommunity(formData, community._id);
      const updated = { ...community, description: desc };
      onCommunityChange?.(updated);
      message.success('Description updated');
    } catch (err) {
      message.error('Failed to update description');
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  return (
    <Card
      classNames={{ body: '!p-4' }}
      className="community-sidebar sticky !hidden h-fit !bg-transparent text-start !shadow-md md:!block"
    >
      <div className="flex w-full items-center justify-between">
        <Title
          level={5}
          className="!mb-2 cursor-pointer truncate"
          onClick={() => navigate(getRoutePath('COMMUNITY').replace(':slug', community?.slug))}
        >
          r/{community?.name}
        </Title>

        {/* ✏️ Edit Button */}
        {community?.owner === user._id && (
          <MdModeEditOutline
            className="cursor-pointer text-xl text-gray-500 hover:text-blue-500"
            onClick={() => setEditing(true)}
          />
        )}
      </div>

      {/* Description */}
      {editing ? (
        <div className="flex flex-col gap-2">
          <TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            disabled={saving}
          />
          <div className="flex justify-end gap-2">
            <Button size="small" onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="primary" size="small" onClick={handleSave} loading={saving}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <Paragraph className="text-sm whitespace-pre-line">
          {desc || 'No description yet.'}
        </Paragraph>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div>
          <Text type="secondary" className="block text-xs dark:!text-gray-400">
            <Text className="mr-1" strong>
              {community?.followersCount || 0}
            </Text>
            Members
          </Text>
        </div>
        {allDetails && (
          <Button
            className="border border-gray-50"
            disabled={state.joining}
            type={community.isFollowing ? 'default' : 'primary'}
            onClick={async () => {
              setState((prev) => ({ ...prev, joining: true }));
              try {
                await CommunityOp._followToggle(community._id);
                onCommunityChange?.({
                  ...community,
                  isFollowing: !community.isFollowing,
                });
              } finally {
                setState((prev) => ({ ...prev, joining: false }));
              }
            }}
          >
            {community.isFollowing ? 'Joined' : 'Join'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Communitysidebar;
