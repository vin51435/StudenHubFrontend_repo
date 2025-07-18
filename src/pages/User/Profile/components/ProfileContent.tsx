import { useAppSelector } from '@src/redux/hook';
import { IUser } from '@src/types/app';
import { Avatar, Tabs, TabsProps, Typography } from 'antd';
import { useEffect, useState } from 'react';
import DefaultAvatar from '/profile-default.svg';
import DisplayProfileContents from './DisplayProfileContents';

const ProfileContent = ({
  user,
  updateProfile,
}: {
  user: IUser;
  updateProfile: (ele: Partial<IUser>) => void;
}) => {
  const client = useAppSelector((state) => state.auth.user);
  const [self, setSelf] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => setSelf(user._id === client?._id), [user._id, client?._id]);

  const tabs: TabsProps['items'] = [
    {
      label: 'Overview',
      key: '1',
      children: <DisplayProfileContents type="overview" userId={self ? undefined : user._id} />,
    },
    {
      label: 'Posts',
      key: '2',
      children: <DisplayProfileContents userId={self ? undefined : user._id} type="posts" />,
    },
    {
      label: 'Comments',
      key: '3',
      children: <DisplayProfileContents userId={self ? undefined : user._id} type="comments" />,
    },
  ];

  if (self) {
    tabs.push.apply(tabs, [
      {
        label: 'Saved',
        key: '4',
        children: <DisplayProfileContents userId={self ? undefined : user._id} type="saved" />,
      },
      {
        label: 'Upvoted',
        key: '5',
        children: <DisplayProfileContents userId={self ? undefined : user._id} type="upvoted" />,
      },
      {
        label: 'Downvoted',
        key: '6',
        children: <DisplayProfileContents userId={self ? undefined : user._id} type="downvoted" />,
      },
    ]);
  }

  return (
    <div className="profile-main_container w-full">
      <div className="mb-4 flex w-full flex-row items-center justify-start">
        <Avatar
          size={100}
          className="object-contain"
          alt="profile image"
          src={user.profilePicture ?? DefaultAvatar}
        />
        <div className="ml-4 text-start">
          <Typography.Title level={2} className="!m-0 !p-0">
            {user.fullName}
          </Typography.Title>
          <Typography.Text className="text-start">@{user.username}</Typography.Text>
        </div>
      </div>
      <Tabs
        defaultActiveKey="1"
        size={'middle'}
        items={tabs}
        type="card"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
      />
    </div>
  );
};

export default ProfileContent;
