import UserOp from '@src/api/userOperations';
import ProfileContent from '@src/pages/User/Profile/components/ProfileContent';
import ProfileSidebar from '@src/pages/User/Profile/components/ProfileSidebar';
import { useAppSelector } from '@src/redux/hook';
import { IUser } from '@src/types/app';
import { Row, Col } from 'antd';
import React, { JSX, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Profile = () => {
  const [userProfile, setUserProfile] = useState<{ data: IUser | null; loading: boolean }>({
    data: null,
    loading: true,
  });
  const client = useAppSelector((state) => state.auth.user);
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (username === client?.username) {
      setUserProfile((prev) => ({ ...prev, data: client!, loading: false }));
    } else {
      UserOp.fetchUserInfo(username!)
        .then((res) => {
          setUserProfile((prev) => ({ ...prev, data: res ?? null }));
        })
        .finally(() => setUserProfile((prev) => ({ ...prev, loading: false })));
    }
  }, [username]);

  if (!userProfile.data && !userProfile.loading) {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <h1>User not found</h1>
      </div>
    );
  }

  const updateProfile = (ele: Partial<IUser>) => {
    setUserProfile((prev) => ({ ...prev, data: { ...prev.data!, ...ele } }));
  };

  return (
    <Row className="user-profile_container w-full mx-auto mt-2 px-3 !border-0" gutter={[18, 18]}>
      <Col span={24} md={16} className="">
        {/* Post Feed */}
        {userProfile.loading ? null : (
          <ProfileContent user={userProfile.data!} updateProfile={updateProfile} />
        )}
      </Col>

      <Col span={0} md={8}>
        {/* Sidebar */}
        {userProfile.loading ? null : (
          <ProfileSidebar user={userProfile.data!} updateProfile={updateProfile} />
        )}{' '}
      </Col>
    </Row>
  );
};

export default Profile;
