import AdminOp from '@src/api/adminOperations';
import { PaginatedTableDashboard } from '@src/components/PaginatedTableDashboard';
import { communityColumns } from '@src/pages/Admin/components/columns/community.columns';
import { message, Button } from 'antd';
import { useState } from 'react';

export default function CommunityDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = async (id: string) => {
    try {
      await AdminOp.deleteCommunity(id);
      message.success('User deleted');
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      message.error('Delete failed');
    }
  };

  return (
    <PaginatedTableDashboard
      title="Communities"
      extra={
        <Button onClick={() => setRefreshKey((prev) => prev + 1)} type="default">
          Refresh
        </Button>
      }
      refreshKey={refreshKey}
      columns={communityColumns(handleDelete)}
      fetchData={AdminOp.getCommunities}
      //   deleteAll={AdminOp.deleteCommunity}
    />
  );
}
