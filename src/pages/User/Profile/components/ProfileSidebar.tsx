import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { SlUserFollow } from 'react-icons/sl';
import { useAppDispatch, useAppSelector } from '@src/redux/hook';
import { IUser } from '@src/types/app';
import { Button, Dropdown, MenuProps, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { IoIosMore } from 'react-icons/io';
import UserOp from '@src/api/userOperations';
import { getRoutePath } from '@src/utils/getRoutePath';
import { updateUser } from '@src/redux/reducers/auth';

const ProfileSidebar = ({
  user,
  updateProfile,
}: {
  user: IUser;
  updateProfile: (ele: Partial<IUser>) => void;
}) => {
  const client = useAppSelector((state) => state.auth.user)!;
  const navigate = useNavigate();
  const self: boolean = user._id === client?._id;
  const dispatch = useAppDispatch();

  const createNewChat = async () => {
    const resNewChatId = await UserOp.createChat(user._id);
    const chatIds = new Set([...(client.chats?.chatIds || []), resNewChatId?.chatId]);
    const updatedClient = { ...client, chats: { chatIds: Array.from(chatIds, String) } };
    dispatch(updateUser(updatedClient));
    navigate(getRoutePath('CHATS'));
  };

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
    <div className="max-h-full w-full overflow-auto rounded-2xl px-4 py-4 text-start dark:bg-[var(--black)]">
      {/* Header with Name and More Button */}
      <div className="mb-1 flex items-center justify-between">
        <Typography.Title level={3} className="!m-0 text-lg font-semibold">
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
        <Typography.Text className="text-md mb-6 text-start text-gray-300">
          {user.bio}
        </Typography.Text>
      </div>

      {/* Actions */}
      {!self && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <Button
            type="default"
            className="flex w-full items-center justify-center gap-2 text-base"
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
            className="flex w-full items-center justify-center gap-2 text-base"
            icon={<IoChatbubbleEllipsesOutline />}
            onClick={() => {
              createNewChat();
            }}
          >
            Chat
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-x-4 gap-y-3 text-start text-sm">
        <div className="">
          <p className="text-lg font-semibold">{user.followersCount}</p>
          <span className="text-xs text-gray-400 uppercase">Followers</span>
        </div>
        <div className="">
          <p className="text-lg font-semibold">{user.followingsCount}</p>
          <span className="text-xs text-gray-400 uppercase">Following</span>
        </div>
        <div className="">
          <p className="text-lg font-semibold">{user.postsCount}</p>
          <span className="text-xs text-gray-400 uppercase">Posts</span>
        </div>
        <div className="">
          <p className="text-lg font-semibold">{'-'}</p>
          <span className="text-xs text-gray-400 uppercase">DOB</span>
        </div>
      </div>

      {/* Extra sections */}
      <Typography.Text
        strong
        className="cursor-pointer text-start text-sm hover:underline"
        onClick={() => {
          navigate(getRoutePath('USER_SETTINGS'));
        }}
      >
        Update profile
      </Typography.Text>
      <div className="mt-2 text-start text-sm text-gray-300">Socials</div>
    </div>
  );
};

export default ProfileSidebar;
