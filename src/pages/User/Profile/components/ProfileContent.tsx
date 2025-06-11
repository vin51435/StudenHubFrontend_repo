import { useAppSelector } from '@src/redux/hook';
import { IUser } from '@src/types/app';
import { Avatar, Tabs, TabsProps, Typography } from 'antd';
import { useState } from 'react';
import DefaultAvatar from '/profile-default.svg';

const ProfileContent = ({
  user,
  updateProfile,
}: {
  user: IUser;
  updateProfile: (ele: Partial<IUser>) => void;
}) => {
  const client = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('1');

  const self: boolean = user._id === client?._id;

  const tabs: TabsProps['items'] = [
    {
      label: 'Overview',
      key: '1',
      children: 'Overview',
    },
    {
      label: 'Posts',
      key: '2',
      children: 'Posts',
    },
    {
      label: 'Comments',
      key: '3',
      children: 'Comments',
    },
  ];

  if (self) {
    tabs.push.apply(tabs, [
      {
        label: 'Saved',
        key: '4',
        children: 'Saved',
      },
      { label: 'Upvoted', key: '5', children: 'Upvoted' },
      { label: 'Downvoted', key: '6', children: 'Downvoted' },
    ]);
  }

  return (
    <div className="profile-main_container w-full">
      <div className="w-full flex flex-row justify-start items-center mb-4">
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
