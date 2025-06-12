import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { SlUserFollow } from 'react-icons/sl';
import { useAppSelector } from '@src/redux/hook';
import { IUser } from '@src/types/app';
import { Button, Dropdown, MenuProps, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { IoIosMore } from 'react-icons/io';
import UserOp from '@src/api/userOperations';
import { getRoutePath } from '@src/utils/getRoutePath';

const ProfileSidebar = ({
  user,
  updateProfile,
}: {
  user: IUser;
  updateProfile: (ele: Partial<IUser>) => void;
}) => {
  const client = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const self: boolean = user._id === client?._id;

  const moreOptions: MenuProps['items'] = [
    {
      label: 'Share',
      key: 'share',
      onClick: () => {
        const shareData = {
          title: 'Check out my profile on StudenHub!',
          url: window.location.href,
        };

        if (navigator.share) {
          navigator
            .share(shareData)
            .then(() => console.log('Shared'))
            .catch((error) => console.log('Error sharing:', error));
        } else {
          // Fallback: Copy to clipboard
          navigator.clipboard
            .writeText(shareData.url)
            .then(() => {
              alert('Link copied to clipboard! Share it manually.');
            })
            .catch((err) => {
              console.error('Clipboard error:', err);
              alert('Unable to share or copy the link.');
            });
        }
      },
    },
  ];

  return (
    <div className="w-full max-h-full overflow-auto dark:bg-[var(--black)] rounded-2xl px-4 py-4 text-start">
      {/* Header with Name and More Button */}
      <div className="mb-1 flex justify-between items-center">
        <Typography.Title level={3} className="text-lg font-semibold !m-0">
          {user.fullName}
        </Typography.Title>
        <Dropdown
          menu={{ items: moreOptions }}
          className="flex items-center justify-center"
          placement="bottomRight"
        >
          <Button type="text" icon={<IoIosMore size={20} />} />
        </Dropdown>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <Typography.Text className="text-md text-start text-gray-300 mb-6">
          {user.bio}
        </Typography.Text>
      </div>

      {/* Actions */}
      {!self && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            type="default"
            className="w-full text-base flex items-center gap-2 justify-center"
            icon={<SlUserFollow />}
            onClick={async () => {
              await UserOp.followUser(user._id);
              updateProfile({ isFollowing: !user.isFollowing });
            }}
          >
            {user.isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
          <Button
            type="default"
            className="w-full text-base flex items-center gap-2 justify-center"
            icon={<IoChatbubbleEllipsesOutline />}
            onClick={async () => {
              await UserOp.createChat(user._id);
              navigate(getRoutePath('CHATS'));
            }}
          >
            Chat
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-start text-sm mb-6">
        <div className="">
          <p className="text-lg font-semibold">{user.followersCount}</p>
          <span className="uppercase text-xs text-gray-400">Followers</span>
        </div>
        <div className="">
          <p className="text-lg font-semibold">{user.followingsCount}</p>
          <span className="uppercase text-xs text-gray-400">Following</span>
        </div>
        <div className="">
          <p className="text-lg font-semibold">{user.postsCount}</p>
          <span className="uppercase text-xs text-gray-400">Posts</span>
        </div>
        <div className="">
          <p className="text-lg font-semibold">{'-'}</p>
          <span className="uppercase text-xs text-gray-400">DOB</span>
        </div>
      </div>

      {/* Extra sections */}
      <div
        className="text-start text-sm text-gray-300"
        onClick={() => {
          navigate(getRoutePath('USER_SETTINGS'));
        }}
      >
        Update profile
      </div>
      <div className="text-start text-sm text-gray-300 mt-2">Socials</div>
    </div>
  );
};

export default ProfileSidebar;
