import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Tabs, List, Avatar, Skeleton, Empty, Pagination } from 'antd';
import type { TabsProps } from 'antd';
import CommunityOp from '@src/api/communityOperations';
import UserOp from '@src/api/userOperations';
import { getRoutePath } from '@src/utils/getRoutePath';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const SearchPage: React.FC = () => {
  const query = useQuery().get('query')?.trim() || '';
  const [activeTab, setActiveTab] = useState<'communities' | 'users'>('communities');

  // Community state
  const [communityData, setCommunityData] = useState<any[]>([]);
  const [communityPagination, setCommunityPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    pageSize: 10,
  });

  // User state
  const [userData, setUserData] = useState<any[]>([]);
  const [userPagination, setUserPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    pageSize: 10,
  });

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    // if (!query) return;
    setLoading(true);

    const [commRes, userRes] = await Promise.allSettled([
      CommunityOp.search(query, { page: String(communityPagination?.currentPage) }),
      UserOp._searchUser(query, userPagination.currentPage),
    ]);

    if (commRes.status === 'fulfilled') {
      setCommunityData(commRes.value?.data || []);
      setCommunityPagination((prev) => ({
        ...prev,
        totalItems: commRes?.value!.totalItems,
        pageSize: commRes?.value!.pageSize,
      }));
    }

    if (userRes.status === 'fulfilled') {
      setUserData(userRes.value.data || []);
      setUserPagination((prev) => ({
        ...prev,
        totalItems: userRes.value.totalItems,
        pageSize: userRes.value.pageSize,
      }));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [query, communityPagination.currentPage, userPagination.currentPage]);

  const handleCommunityPageChange = (page: number) =>
    setCommunityPagination((prev) => ({ ...prev, currentPage: page }));

  const handleUserPageChange = (page: number) =>
    setUserPagination((prev) => ({ ...prev, currentPage: page }));

  const communityList = (
    <>
      <List
        itemLayout="horizontal"
        dataSource={communityData}
        loading={loading}
        locale={{ emptyText: <Empty description="No communities found" /> }}
        renderItem={(c) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={c.avatarUrl} />}
              title={
                <Link to={getRoutePath('COMMUNITY').replace(':slug', c.slug)}>r/{c.name}</Link>
              }
              description={c.description || `r/${c.name}`}
            />
          </List.Item>
        )}
      />
      {communityPagination.totalItems > communityPagination.pageSize && (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={communityPagination.currentPage}
            pageSize={communityPagination.pageSize}
            total={communityPagination.totalItems}
            onChange={handleCommunityPageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </>
  );

  const userList = (
    <>
      <List
        itemLayout="horizontal"
        dataSource={userData}
        loading={loading}
        locale={{ emptyText: <Empty description="No users found" /> }}
        renderItem={(u) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={u.profilePicture} />}
              title={
                <Link
                  to={getRoutePath('USER_PROFILE').replace(':username', u.username)}
                  className="flex cursor-pointer items-center"
                >
                  {' '}
                  u/{u.username}
                </Link>
              }
              description={u.fullName}
            />
          </List.Item>
        )}
      />
      {userPagination.totalItems > userPagination.pageSize && (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={userPagination.currentPage}
            pageSize={userPagination.pageSize}
            total={userPagination.totalItems}
            onChange={handleUserPageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'communities',
      label: `Communities (${communityPagination.totalItems})`,
      children: communityList,
    },
    {
      key: 'users',
      label: `Users (${userPagination.totalItems})`,
      children: userList,
    },
  ];

  return (
    <div className="max-w-3xl text-start">
      <h2 className="mb-4 text-xl font-semibold">
        Search results for: <span className="text-blue-600">"{query}"</span>
      </h2>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'communities' | 'users')}
        items={tabItems}
      />
    </div>
  );
};

export default SearchPage;
